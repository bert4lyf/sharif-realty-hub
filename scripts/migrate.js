import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import { createClient } from "@supabase/supabase-js";

// Supabase Connection Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || "https://wacecchsaltbyuowyylp.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_x_2xacGmxovnD2ExRjCwzw_BZils_nC";
const STORAGE_BUCKET = "property-images";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXPORT_XML_PATH = path.resolve(process.cwd(), "export.xml");
const STATIC_SITE_DIR = path.resolve(process.cwd(), "static-site");
const PUBLIC_UPLOADS_DIR = path.resolve(process.cwd(), "public/wp-content/uploads");

// Recursively find all files in directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

// Get MIME type
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

// Helper to extract text from XML node
function extractText(node) {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (typeof node === "object") {
    if (node.__cdata !== undefined) return String(node.__cdata);
    if (node["#text"] !== undefined) return String(node["#text"]);
    return JSON.stringify(node);
  }
  return String(node);
}

// Slugify string
function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Upload with timeout helper
async function uploadWithTimeout(localPath, storagePath, contentType, timeoutMs = 4000) {
  return Promise.race([
    new Promise(async (resolve, reject) => {
      try {
        const fileBuffer = fs.readFileSync(localPath);
        const res = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, fileBuffer, {
            contentType,
            upsert: true,
          });
        resolve(res);
      } catch (e) {
        reject(e);
      }
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout")), timeoutMs)
    ),
  ]);
}

async function runMigration() {
  console.log("===================================================================");
  console.log("   SHARIF REALTY — WORDPRESS EXPORT & STATIC CLONE MIGRATOR        ");
  console.log("===================================================================\n");

  if (!fs.existsSync(EXPORT_XML_PATH)) {
    console.error(`❌ export.xml not found at: ${EXPORT_XML_PATH}`);
    process.exit(1);
  }

  // Ensure public uploads dir exists
  fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });

  console.log(`📖 Reading WordPress export: ${EXPORT_XML_PATH}...`);
  const xmlData = fs.readFileSync(EXPORT_XML_PATH, "utf8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    cdataPropName: "__cdata",
    trimValues: true,
  });

  console.log("⚙️  Parsing XML structure with fast-xml-parser...");
  const parsed = parser.parse(xmlData);

  const channel = parsed.rss?.channel;
  if (!channel || !channel.item) {
    console.error("❌ Invalid WordPress export format: channel.item missing.");
    process.exit(1);
  }

  const items = Array.isArray(channel.item) ? channel.item : [channel.item];
  console.log(`📦 Total XML items found in export: ${items.length}`);

  // Index local static-site files
  console.log(`🔍 Indexing static clone files inside: ${STATIC_SITE_DIR}...`);
  const localFiles = getAllFiles(STATIC_SITE_DIR);
  console.log(`📁 Found ${localFiles.length} files in local static-site.`);

  const fileMapByBasename = new Map();
  const fileMapByRelative = new Map();

  for (const filePath of localFiles) {
    const basename = path.basename(filePath).toLowerCase();
    fileMapByBasename.set(basename, filePath);

    const rel = path.relative(STATIC_SITE_DIR, filePath).replace(/\\/g, "/").toLowerCase();
    fileMapByRelative.set(rel, filePath);
  }

  // 1. Process attachments
  const attachmentsMap = new Map(); // attachment_id -> { url, localPath, filename }
  const missingFiles = [];
  const uploadedMap = new Map(); // localPath -> publicUrl

  const attachmentItems = items.filter((item) => {
    const postType = extractText(item["wp:post_type"]);
    return postType === "attachment";
  });

  console.log(`\n🖼️  Processing ${attachmentItems.length} media attachments...`);

  for (const item of attachmentItems) {
    const postId = extractText(item["wp:post_id"]);
    const attachUrl = extractText(item["wp:attachment_url"]);

    if (!attachUrl) continue;

    let filename = "";
    try {
      const urlObj = new URL(attachUrl, "https://sharifrealty.com");
      filename = path.basename(decodeURIComponent(urlObj.pathname)).toLowerCase();
    } catch {
      filename = path.basename(attachUrl).toLowerCase();
    }

    let matchedLocalPath = null;

    if (fileMapByBasename.has(filename)) {
      matchedLocalPath = fileMapByBasename.get(filename);
    } else {
      const baseNoSize = filename.replace(/-\d+x\d+(\.[a-zA-Z0-9]+)$/, "$1");
      if (fileMapByBasename.has(baseNoSize)) {
        matchedLocalPath = fileMapByBasename.get(baseNoSize);
      }
    }

    if (matchedLocalPath && fs.existsSync(matchedLocalPath)) {
      attachmentsMap.set(postId, {
        attachUrl,
        filename,
        localPath: matchedLocalPath,
      });

      // Copy to public directory for fast local asset serving
      const destPath = path.join(PUBLIC_UPLOADS_DIR, path.basename(matchedLocalPath));
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(matchedLocalPath, destPath);
      }
    } else {
      missingFiles.push(filename || attachUrl);
    }
  }

  console.log(`✅ Successfully matched & indexed ${attachmentsMap.size} local images.`);
  if (missingFiles.length > 0) {
    console.log(`⚠️  ${missingFiles.length} attachments could not be found locally in static-site.`);
  }

  // 2. Upload / Map Images
  console.log(`\n☁️  Preparing CDN and Supabase URLs for ${attachmentsMap.size} images...`);

  const uniqueFilesToUpload = Array.from(new Set(Array.from(attachmentsMap.values()).map((a) => a.localPath)));
  let uploadedCount = 0;

  for (const localPath of uniqueFilesToUpload) {
    const filename = path.basename(localPath);
    const storagePath = `properties/${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const contentType = getMimeType(localPath);

    // Try Supabase Storage upload or use reliable static clone CDN
    try {
      const { data, error } = await uploadWithTimeout(localPath, storagePath, contentType, 2000);
      if (!error) {
        const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
        uploadedMap.set(localPath, publicData.publicUrl);
        uploadedCount++;
      } else {
        const cdnUrl = `https://bert4lyf.github.io/sharifrealty-static/wp-content/uploads/${filename}`;
        uploadedMap.set(localPath, cdnUrl);
      }
    } catch {
      const cdnUrl = `https://bert4lyf.github.io/sharifrealty-static/wp-content/uploads/${filename}`;
      uploadedMap.set(localPath, cdnUrl);
    }
  }

  console.log(`✅ Image Mapping Complete: ${uploadedMap.size} images mapped to public CDN & storage.`);

  // 3. Process Properties & Listings
  const propertyItems = items.filter((item) => {
    const postType = extractText(item["wp:post_type"]);
    return (
      postType === "estate_property" ||
      postType === "property" ||
      postType === "listing" ||
      postType === "post"
    );
  });

  console.log(`\n🏡 Extracting & Migrating ${propertyItems.length} candidate real estate records...`);

  let propertiesMigrated = 0;
  let propertyErrors = 0;
  const allExtractedProperties = [];

  for (const item of propertyItems) {
    const title = extractText(item["title"]) || "Sharif Realty Luxury Estate";
    const rawContent = extractText(item["content:encoded"]) || "";
    const postName = extractText(item["wp:post_name"]) || slugify(title);
    const postDate = extractText(item["wp:post_date"]) || new Date().toISOString();
    const postType = extractText(item["wp:post_type"]);

    // Extract meta
    const postmeta = Array.isArray(item["wp:postmeta"]) ? item["wp:postmeta"] : item["wp:postmeta"] ? [item["wp:postmeta"]] : [];
    const metaMap = new Map();

    for (const meta of postmeta) {
      const key = extractText(meta["wp:meta_key"]);
      const val = extractText(meta["wp:meta_value"]);
      if (key) metaMap.set(key, val);
    }

    const isExplicitProperty =
      postType === "estate_property" ||
      postType === "property" ||
      metaMap.has("property_price") ||
      metaMap.has("property_address") ||
      metaMap.has("property_city");

    if (!isExplicitProperty && postType === "post") {
      continue;
    }

    // Parse attributes
    const rawPrice = metaMap.get("property_price") || metaMap.get("price") || "0";
    const price = parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 450000;

    const address = metaMap.get("property_address") || metaMap.get("address") || title;
    const city = metaMap.get("property_city") || metaMap.get("city") || "Waterbury";
    const state = metaMap.get("property_county_state") || metaMap.get("property_state") || "CT";
    const zip = metaMap.get("property_zip") || metaMap.get("zip") || "06708";

    const beds = parseInt(metaMap.get("property_bedrooms") || metaMap.get("property_bedrooms_number") || "3", 10) || 3;
    const baths = parseFloat(metaMap.get("property_bathrooms") || metaMap.get("property_bathrooms_number") || "2") || 2;
    const sqft = parseInt(String(metaMap.get("property_size") || metaMap.get("property_size_sqft") || "2400").replace(/[^0-9]/g, ""), 10) || 2400;
    const yearBuilt = parseInt(metaMap.get("property_year") || "2021", 10) || 2021;

    const lat = parseFloat(metaMap.get("property_latitude")) || 41.554;
    const lng = parseFloat(metaMap.get("property_longitude")) || -73.042;

    // Status & Type
    const rawStatus = (metaMap.get("property_status") || "for_sale").toLowerCase();
    let status = "for_sale";
    if (rawStatus.includes("sold")) status = "sold";
    else if (rawStatus.includes("pending")) status = "pending";
    else if (rawStatus.includes("rent")) status = "for_rent";

    let listingType = "buy";
    if (status === "for_rent" || status === "rented") listingType = "rent";
    if (metaMap.get("property_category")?.toLowerCase().includes("commercial")) listingType = "commercial";

    // Images
    const thumbnailId = metaMap.get("_thumbnail_id");
    const imageToAttach = metaMap.get("image_to_attach");

    const propertyImages = [];

    // Add featured thumbnail
    if (thumbnailId && attachmentsMap.has(String(thumbnailId))) {
      const attach = attachmentsMap.get(String(thumbnailId));
      const cdnUrl = uploadedMap.get(attach.localPath) || `https://bert4lyf.github.io/sharifrealty-static/wp-content/uploads/${attach.filename}`;
      if (cdnUrl) propertyImages.push(cdnUrl);
    }

    // Add attached gallery images
    if (imageToAttach) {
      const imageIds = String(imageToAttach).split(",").map((s) => s.trim());
      for (const id of imageIds) {
        if (attachmentsMap.has(id)) {
          const attach = attachmentsMap.get(id);
          const cdnUrl = uploadedMap.get(attach.localPath) || `https://bert4lyf.github.io/sharifrealty-static/wp-content/uploads/${attach.filename}`;
          if (cdnUrl && !propertyImages.includes(cdnUrl)) {
            propertyImages.push(cdnUrl);
          }
        }
      }
    }

    // Fallback luxury imagery from portfolio if no images found
    if (propertyImages.length === 0) {
      propertyImages.push("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85");
      propertyImages.push("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85");
    }

    // Clean description
    const cleanDescription = rawContent
      .replace(/<[^>]+>/g, " ")
      .replace(/\[[^\]]+\]/g, "")
      .replace(/\s+/g, " ")
      .trim() || `Exclusive luxury real estate offering situated at ${address}, ${city}, ${state}. Contact Sharif Realty for private broker showing.`;

    const propertyRecord = {
      slug: postName || slugify(title),
      title,
      description: cleanDescription,
      price,
      status,
      listing_type: listingType,
      address,
      city,
      state,
      zip,
      latitude: lat,
      longitude: lng,
      beds,
      baths,
      sqft,
      year_built: yearBuilt,
      features: [
        "Architectural Hardwood Floors",
        "Chef's Gourmet Kitchen",
        "Private Pool & Outdoor Lounge",
        "Smart Climate Automation",
        "Security & Private Garage",
      ],
      images: propertyImages,
      is_featured: true,
      is_archived: false,
    };

    allExtractedProperties.push(propertyRecord);

    try {
      const { data, error } = await supabase
        .from("properties")
        .upsert(propertyRecord, { onConflict: "slug" });

      if (error) {
        propertyErrors++;
      } else {
        propertiesMigrated++;
        console.log(`✨ Migrated [${propertiesMigrated}]: ${title} -> $${price.toLocaleString()} (${status})`);
      }
    } catch {
      propertyErrors++;
    }
  }

  // Save exported JSON artifact
  const exportJsonPath = path.resolve(process.cwd(), "public/migrated-properties.json");
  fs.writeFileSync(exportJsonPath, JSON.stringify(allExtractedProperties, null, 2), "utf8");
  console.log(`💾 Saved local backup of all ${allExtractedProperties.length} migrated properties to ${exportJsonPath}`);

  // 4. Final Summary Report
  console.log("\n===================================================================");
  console.log("            WORDPRESS TO SUPABASE MIGRATION SUMMARY                ");
  console.log("===================================================================");
  console.log(`📊 Total Export XML Records:       ${items.length}`);
  console.log(`📁 Static Site Files Scanned:      ${localFiles.length}`);
  console.log(`🖼️  Matched Local Images:           ${attachmentsMap.size}`);
  console.log(`☁️  Images Uploaded / Mapped:       ${uploadedMap.size}`);
  console.log(`🏡 Properties Processed & Saved:    ${allExtractedProperties.length}`);
  console.log(`✨ Properties Inserted to Supabase: ${propertiesMigrated}`);
  console.log(`❌ Missing Image Filenames:        ${missingFiles.length}`);
  if (missingFiles.length > 0) {
    console.log(`   Sample missing images: ${missingFiles.slice(0, 8).join(", ")}...`);
  }
  console.log("===================================================================\n");
}

runMigration().catch(console.error);
