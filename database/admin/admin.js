// Initialize Supabase
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentListingId = null;
let currentAgentId = null;

// Check authentication on load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await checkAuth();
    loadDashboard();
  } catch (error) {
    console.error('Error:', error);
  }
});

async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    window.location.href = 'login.html';
  }
}

async function loadDashboard() {
  await loadListings();
  await loadAgents();
  await loadInquiries();
  await updateStats();
}

// Update dashboard stats
async function updateStats() {
  const { data: listings } = await supabaseClient.from('listings').select('id');
  const { data: agents } = await supabaseClient.from('agents').select('id');
  const { data: inquiries } = await supabaseClient
    .from('inquiries')
    .select('id')
    .eq('status', 'new');

  document.getElementById('listing-count').textContent = listings?.length || 0;
  document.getElementById('agent-count').textContent = agents?.length || 0;
  document.getElementById('inquiry-count').textContent = inquiries?.length || 0;
}

// Load Listings
async function loadListings() {
  const { data, error } = await supabaseClient
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading listings:', error);
    showMessage('Error loading listings', 'error', 'messages');
    return;
  }

  const tbody = document.getElementById('listings-table');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No listings found. Add one to get started!</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(listing => `
    <tr>
      <td>${listing.title}</td>
      <td>$${parseInt(listing.price).toLocaleString()}</td>
      <td>${listing.location}</td>
      <td>${listing.beds || '-'}</td>
      <td>${listing.status || 'For Sale'}</td>
      <td>
        <button onclick="editListing(${listing.id})">Edit</button>
        <button class="delete" onclick="deleteListing(${listing.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Load Agents
async function loadAgents() {
  const { data, error } = await supabaseClient
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading agents:', error);
    showMessage('Error loading agents', 'error', 'messages-agents');
    return;
  }

  const tbody = document.getElementById('agents-table');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No agents found. Add one to get started!</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(agent => `
    <tr>
      <td>${agent.name}</td>
      <td>${agent.email || '-'}</td>
      <td>${agent.phone || '-'}</td>
      <td>${agent.specialty || '-'}</td>
      <td>${agent.active ? 'Active' : 'Inactive'}</td>
      <td>
        <button onclick="editAgent(${agent.id})">Edit</button>
        <button class="delete" onclick="deleteAgent(${agent.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Load Inquiries
async function loadInquiries() {
  const { data, error } = await supabaseClient
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading inquiries:', error);
    return;
  }

  const tbody = document.getElementById('inquiries-table');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No inquiries found.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(inquiry => `
    <tr>
      <td>${inquiry.name}</td>
      <td>${inquiry.email}</td>
      <td>${inquiry.message?.substring(0, 50)}...</td>
      <td>${new Date(inquiry.created_at).toLocaleDateString()}</td>
      <td>${inquiry.status}</td>
      <td>
        <button onclick="updateInquiryStatus(${inquiry.id}, '${inquiry.status}')">Update</button>
      </td>
    </tr>
  `).join('');
}

// Add Listing
async function addListing(e) {
  e.preventDefault();

  const title = document.getElementById('listing-title').value;
  const price = document.getElementById('listing-price').value;
  const location = document.getElementById('listing-location').value;
  const beds = document.getElementById('listing-beds').value;
  const baths = document.getElementById('listing-baths').value;
  const sqft = document.getElementById('listing-sqft').value;
  const status = document.getElementById('listing-status').value;
  const description = document.getElementById('listing-desc').value;

  const listingData = {
    title,
    price: parseFloat(price),
    location,
    beds: beds ? parseInt(beds) : null,
    baths: baths ? parseInt(baths) : null,
    sqft: sqft ? parseInt(sqft) : null,
    status,
    description
  };

  let error;

  if (currentListingId) {
    // Update existing listing
    const result = await supabaseClient
      .from('listings')
      .update(listingData)
      .eq('id', currentListingId);
    error = result.error;
  } else {
    // Insert new listing
    const result = await supabaseClient
      .from('listings')
      .insert([listingData]);
    error = result.error;
  }

  if (error) {
    showMessage('Error saving listing: ' + error.message, 'error', 'messages');
  } else {
    showMessage('Listing saved successfully!', 'success', 'messages');
    closeModal('listingModal');
    currentListingId = null;
    loadListings();
  }
}

// Edit Listing
async function editListing(id) {
  const { data, error } = await supabaseClient
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading listing:', error);
    return;
  }

  currentListingId = id;
  document.getElementById('listing-form-title').textContent = 'Edit Listing';
  document.getElementById('listing-title').value = data.title;
  document.getElementById('listing-price').value = data.price;
  document.getElementById('listing-location').value = data.location;
  document.getElementById('listing-beds').value = data.beds || '';
  document.getElementById('listing-baths').value = data.baths || '';
  document.getElementById('listing-sqft').value = data.sqft || '';
  document.getElementById('listing-status').value = data.status || 'For Sale';
  document.getElementById('listing-desc').value = data.description || '';

  showModal('listingModal');
}

// Delete Listing
async function deleteListing(id) {
  if (!confirm('Are you sure you want to delete this listing?')) return;

  const { error } = await supabaseClient
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    showMessage('Error deleting listing: ' + error.message, 'error', 'messages');
  } else {
    showMessage('Listing deleted successfully!', 'success', 'messages');
    loadListings();
  }
}

// Add Agent
async function addAgent(e) {
  e.preventDefault();

  const name = document.getElementById('agent-name').value;
  const email = document.getElementById('agent-email').value;
  const phone = document.getElementById('agent-phone').value;
  const specialty = document.getElementById('agent-specialty').value;
  const bio = document.getElementById('agent-bio').value;

  const agentData = {
    name,
    email,
    phone: phone || null,
    specialty: specialty || null,
    bio: bio || null,
    active: true
  };

  let error;

  if (currentAgentId) {
    const result = await supabaseClient
      .from('agents')
      .update(agentData)
      .eq('id', currentAgentId);
    error = result.error;
  } else {
    const result = await supabaseClient
      .from('agents')
      .insert([agentData]);
    error = result.error;
  }

  if (error) {
    showMessage('Error saving agent: ' + error.message, 'error', 'messages-agents');
  } else {
    showMessage('Agent saved successfully!', 'success', 'messages-agents');
    closeModal('agentModal');
    currentAgentId = null;
    loadAgents();
  }
}

// Edit Agent
async function editAgent(id) {
  const { data, error } = await supabaseClient
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading agent:', error);
    return;
  }

  currentAgentId = id;
  document.getElementById('agent-form-title').textContent = 'Edit Agent';
  document.getElementById('agent-name').value = data.name;
  document.getElementById('agent-email').value = data.email;
  document.getElementById('agent-phone').value = data.phone || '';
  document.getElementById('agent-specialty').value = data.specialty || '';
  document.getElementById('agent-bio').value = data.bio || '';

  showModal('agentModal');
}

// Delete Agent
async function deleteAgent(id) {
  if (!confirm('Are you sure you want to delete this agent?')) return;

  const { error } = await supabaseClient
    .from('agents')
    .delete()
    .eq('id', id);

  if (error) {
    showMessage('Error deleting agent: ' + error.message, 'error', 'messages-agents');
  } else {
    showMessage('Agent deleted successfully!', 'success', 'messages-agents');
    loadAgents();
  }
}

// Update Inquiry Status
async function updateInquiryStatus(id, currentStatus) {
  const newStatus = currentStatus === 'new' ? 'reviewed' : 'new';
  const { error } = await supabaseClient
    .from('inquiries')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    alert('Error updating inquiry: ' + error.message);
  } else {
    loadInquiries();
  }
}

// UI Functions
function showSection(section) {
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  document.getElementById(section).classList.add('active');
}

function showModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
  // Reset forms
  if (modalId === 'listingModal') {
    document.getElementById('listingForm').reset();
    document.getElementById('listing-form-title').textContent = 'Add New Listing';
    currentListingId = null;
  } else if (modalId === 'agentModal') {
    document.getElementById('agentForm').reset();
    document.getElementById('agent-form-title').textContent = 'Add New Agent';
    currentAgentId = null;
  }
}

function showAddListingForm() {
  currentListingId = null;
  document.getElementById('listingForm').reset();
  document.getElementById('listingForm').onsubmit = addListing;
  document.getElementById('listing-form-title').textContent = 'Add New Listing';
  showModal('listingModal');
}

function showAddAgentForm() {
  currentAgentId = null;
  document.getElementById('agentForm').reset();
  document.getElementById('agentForm').onsubmit = addAgent;
  document.getElementById('agent-form-title').textContent = 'Add New Agent';
  showModal('agentModal');
}

function showMessage(message, type, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
  const html = `<div class="alert ${alertClass}">${message}</div>`;
  container.innerHTML = html;

  // Auto-remove after 5 seconds
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  const listingModal = document.getElementById('listingModal');
  const agentModal = document.getElementById('agentModal');

  if (event.target === listingModal) {
    closeModal('listingModal');
  }
  if (event.target === agentModal) {
    closeModal('agentModal');
  }
});
