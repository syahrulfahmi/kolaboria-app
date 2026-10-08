const steps = Array.from(document.querySelectorAll('[data-step]'))
const stepItems = Array.from(document.querySelectorAll('[data-step-item]'))
const nextButton = document.querySelector('#next-button')
const backButton = document.querySelector('#back-button')
const submitButton = document.querySelector('#submit-button')
const saveButton = document.querySelector('#save-button')
const toast = document.querySelector('#toast')
const views = {
  create: document.querySelector('#create-view'),
  running: document.querySelector('#running-view')
}
const contextSelect = document.querySelector('#project-context')
const ownershipMode = document.querySelector('#ownership-mode')
const initiatorType = document.querySelector('#initiator-type')
const initiatorName = document.querySelector('#initiator-name')
const ownerType = document.querySelector('#owner-type')
const ownerName = document.querySelector('#owner-name')
const ownerIsInitiator = document.querySelector('#owner-is-initiator')
const leadPerson = document.querySelector('#lead-person')
const leadIsOwner = document.querySelector('#lead-is-owner')
const totalPositions = 5
let currentStep = 0
let toastTimer
let submittedForPublication = false
let ownershipClaimed = false
let workspaceReady = false

function showToast(message) {
  toast.textContent = message
  toast.classList.add('show')
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600)
}

function setStep(step) {
  currentStep = Math.max(0, Math.min(4, step))
  steps.forEach((panel, index) => panel.classList.toggle('hidden', index !== currentStep))
  stepItems.forEach((item, index) => {
    item.classList.toggle('current', index === currentStep)
    item.classList.toggle('done', index < currentStep)
    item.setAttribute('aria-current', index === currentStep ? 'step' : 'false')
  })
  backButton.classList.toggle('hidden', currentStep === 0)
  nextButton.classList.toggle('hidden', currentStep === 4)
  submitButton.classList.toggle('hidden', currentStep !== 4)
  saveButton.classList.toggle('hidden', currentStep === 4)
  document.querySelector('.form-column').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function setView(name) {
  Object.entries(views).forEach(([key, panel]) => panel.classList.toggle('hidden', key !== name))
  document.querySelectorAll('.view-tab').forEach((tab) => {
    const active = tab.dataset.view === name
    tab.classList.toggle('active', active)
    tab.setAttribute('aria-selected', String(active))
  })
  updateRunState()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function isKolaboriaInitiated() {
  return contextSelect.value === 'kolaboria'
}

function isUnclaimedMode() {
  return isKolaboriaInitiated() && ownershipMode.value === 'unclaimed'
}

function syncOwnerFromInitiator() {
  if (!ownerIsInitiator.checked) return
  ownerName.value = initiatorName.value
  ownerType.value = initiatorType.value === 'Individu' ? 'Individu' : initiatorType.value
}

function syncLeadToOwner() {
  const label = `${ownerName.value.trim() || 'Project Owner'} · Product Lead`
  let option = leadPerson.querySelector('#owner-lead-option')
  if (!option) {
    option = document.createElement('option')
    option.id = 'owner-lead-option'
    leadPerson.append(option)
  }
  option.textContent = label
  option.value = label
  leadPerson.value = label
}

function updateIdentityPreview() {
  const isPlatformInitiated = isKolaboriaInitiated()
  const waitingForOwner = isUnclaimedMode() && !ownershipClaimed
  if (!isUnclaimedMode()) syncOwnerFromInitiator()
  if (isKolaboriaInitiated() && ownershipMode.value === 'designated' && leadIsOwner.checked) syncLeadToOwner()
  const initiator = initiatorName.value || 'Inisiator project'
  const owner = waitingForOwner ? 'Belum ditetapkan' : (ownershipClaimed ? 'Nabila Putri' : (ownerName.value || 'Project owner'))
  const lead = waitingForOwner ? 'Belum ditetapkan' : (ownershipClaimed ? 'Nabila Putri' : (leadPerson.value.split(' · ')[0] || 'Project lead'))
  const projectTitle = document.querySelector('#project-title').value || 'Project Kolaboria'

  document.querySelector('#review-initiator').textContent = initiator
  document.querySelector('#review-origin-mark').textContent = isPlatformInitiated ? 'K' : initiator.slice(0, 1).toUpperCase()
  document.querySelector('#review-origin-label').textContent = isPlatformInitiated ? 'Diinisiasi oleh' : 'Asal project'
  document.querySelector('#record-creator-label').textContent = isPlatformInitiated ? 'Dicatat oleh admin Kolaboria' : 'Dibuat oleh Fahmi'
  document.querySelector('#record-creator-copy').textContent = isPlatformInitiated
    ? 'Project Initiator adalah Kolaboria; akun pencatat record hanya metadata audit.'
    : 'Akun pembuat record adalah metadata audit; perannya ditentukan terpisah.'
  document.querySelector('#review-owner').textContent = owner
  document.querySelector('#review-lead').textContent = lead
  document.querySelector('#running-initiator').textContent = initiator
  document.querySelector('#running-owner').textContent = owner
  document.querySelector('#running-lead').textContent = lead
  document.querySelector('#responsibility-owner').textContent = `${owner} · Owner`
  document.querySelector('#responsibility-lead').textContent = `${lead} · Project Lead`
  document.querySelector('#running-origin-label').textContent = isPlatformInitiated ? 'DIINISIASI OLEH' : 'ASAL PROJECT'
  document.querySelector('#running-origin-copy').textContent = isPlatformInitiated
    ? 'Penggagas project · bukan owner atau pengelola'
    : 'Inisiator sekaligus project owner'
  document.querySelector('#origin-note-copy').textContent = isPlatformInitiated
    ? 'Kolaboria hanya tercatat sebagai pihak yang menginisiasi project. Setelah owner ditetapkan, seleksi contributor, Workspace, dan completion dikelola talent sesuai flow existing.'
    : 'Project ini dimulai oleh talent. Inisiator menjadi owner dan bertanggung jawab atas hasil; pekerjaan harian dijalankan oleh lead yang ditetapkan.'
  document.querySelector('#responsibility-owner-copy').textContent = waitingForOwner
    ? 'Belum ada talent yang memegang keputusan atau mengelola project.'
    : 'Menentukan kebutuhan, memberi konteks produk, dan mengonfirmasi hasil akhir.'
  document.querySelector('#running-owner-copy').textContent = waitingForOwner ? 'Ownership belum diklaim' : 'Validasi kebutuhan dan hasil'
  document.querySelector('#running-lead-copy').textContent = waitingForOwner ? 'Lead belum ditetapkan' : 'Operasional dan koordinasi tim'
  document.querySelector('#review-owner-label').textContent = waitingForOwner ? '' : 'owner'
  document.querySelector('#review-lead-divider').classList.toggle('hidden', waitingForOwner)
  document.querySelector('#review-lead').classList.toggle('hidden', waitingForOwner)
  document.querySelector('#review-lead-label').classList.toggle('hidden', waitingForOwner)
  document.querySelector('#review-ownership-status').textContent = waitingForOwner
    ? 'UNCLAIMED · aplikasi ditutup'
    : 'Owner ditetapkan · aplikasi dapat dibuka'
  document.querySelector('#review-application-status').textContent = waitingForOwner
    ? 'Tertutup sampai owner ditetapkan'
    : 'Dibuka oleh owner'
  document.querySelector('#review-owner-check').textContent = waitingForOwner
    ? 'Status UNCLAIMED tercatat'
    : 'Owner dan lead ditetapkan'
  document.querySelector('#review-readiness-title').textContent = waitingForOwner
    ? 'Project siap dipublikasikan sebagai UNCLAIMED'
    : 'Project siap dibuka'
  document.querySelector('#review-next-title').textContent = waitingForOwner ? 'Sebelum aplikasi dibuka' : 'Setelah dipublikasikan'
  document.querySelector('#review-next-copy').textContent = waitingForOwner
    ? 'Talent yang memenuhi persyaratan dapat Claim Project. Aplikasi contributor tetap tertutup sampai owner ditetapkan.'
    : 'Owner dapat mengelola aplikasi contributor, lalu memulai Workspace.'
  document.querySelector('#review-pending-row').classList.toggle('hidden', waitingForOwner)
  document.querySelector('#running-status-label').textContent = waitingForOwner
    ? (submittedForPublication ? 'UNCLAIMED · APLIKASI TERTUTUP' : 'PREVIEW · BELUM DIPUBLIKASIKAN')
    : 'BERJALAN · MINGGU 2 DARI 4'
  document.querySelector('#running-header-copy').textContent = waitingForOwner
    ? 'Project sudah dipublikasikan, tetapi belum ada owner yang mengambil alih.'
    : 'Tim tahu siapa yang mengambil keputusan, memimpin pekerjaan, dan memberi konteks.'
  document.querySelector('#preview-title').textContent = projectTitle

  document.querySelector('#context-hint').textContent = isPlatformInitiated
    ? 'Kolaboria mengisi peran Project Initiator. Project Owner tetap talent yang ditunjuk atau mengklaim project.'
    : 'Secara default, talent yang menggagas juga menjadi owner. Owner dapat menunjuk lead lain untuk operasional.'
  document.querySelector('#identity-insight').innerHTML = isPlatformInitiated
    ? `<span class="insight-icon">↗</span><p>Kolaboria <strong>hanya sebagai Project Initiator</strong>. ${waitingForOwner ? 'Status UNCLAIMED menutup aplikasi contributor sampai talent mengambil alih.' : 'Talent sebagai Project Owner mengelola seleksi, Workspace, dan completion.'}</p>`
    : '<span class="insight-icon">↗</span><p>Untuk project talent, <strong>inisiator dan owner adalah orang yang sama</strong> secara default. Lead dapat tetap sama atau didelegasikan ke anggota lain.</p>'
  document.querySelector('#owner-commitment-person').textContent = owner
  document.querySelector('#lead-commitment-person').textContent = lead
  updateRoleAvailability(waitingForOwner)
  updateReviewReadiness(waitingForOwner)
  syncCapacity()
  updateRunState()
}

function syncCapacity() {
  const confirmedCount = isUnclaimedMode() && !ownershipClaimed
    ? 0
    : document.querySelectorAll('#create-roster [data-member-state="confirmed"]').length
  const filled = Math.min(confirmedCount, totalPositions)
  const open = Math.max(totalPositions - filled, 0)
  const countLabels = [
    '#filled-position-count',
    '#running-filled-count'
  ]
  countLabels.forEach((selector) => { document.querySelector(selector).textContent = filled })
  document.querySelector('#total-position-count').textContent = totalPositions
  document.querySelector('#running-total-count').textContent = totalPositions
  document.querySelector('#open-position-count').textContent = open
  document.querySelector('#running-open-count').textContent = open
  document.querySelector('#review-confirmed-count').textContent = `${filled} anggota`
  document.querySelector('#review-open-positions').textContent = `${open} posisi terbuka`
  document.querySelector('#roster-capacity-note').textContent = isUnclaimedMode() && !ownershipClaimed
    ? 'Belum ada owner atau anggota yang terkonfirmasi. Contributor belum dapat mengajukan diri.'
    : open
      ? `${filled} anggota mengisi ${filled} dari ${totalPositions} posisi. Undangan yang belum diterima tidak dihitung.`
      : `Semua ${totalPositions} posisi terisi. Undangan tambahan tetap menunggu dan tidak menambah kapasitas.`
  document.querySelector('#running-open-role').classList.toggle('hidden', open === 0)
  document.querySelector('#running-team-full').classList.toggle('hidden', open > 0)
}

function updateRoleAvailability(unclaimed) {
  const roles = [
    { summary: '#product-role-summary', state: '#product-role-state', assignee: '#product-role-assignee', filled: 'Peran inti · 1 orang · terisi', open: 'Peran inti · 1 orang · terbuka', filledState: 'Terisi', openState: 'Owner / Lead terbuka', assigneeFilled: 'Diisi oleh Nabila', assigneeOpen: 'Belum ada Project Lead' },
    { summary: '#design-role-summary', state: '#design-role-state', assignee: '#design-role-assignee', filled: '1 orang · terisi', open: '1 orang · terbuka', filledState: 'Terisi', openState: 'Mencari anggota', assigneeFilled: 'Diisi oleh Arum', assigneeOpen: 'Kontributor' },
    { summary: '#frontend-role-summary', state: '#frontend-role-state', assignee: '#frontend-role-assignee', filled: '2 orang · 1 terisi, 1 terbuka', open: '2 orang · terbuka', filledState: '1 posisi terbuka', openState: 'Mencari anggota', assigneeFilled: '1 terisi oleh Rizky', assigneeOpen: 'Kontributor' },
    { summary: '#backend-role-summary', state: '#backend-role-state', assignee: '#backend-role-assignee', filled: 'Peran inti · 1 orang · terisi', open: 'Peran inti · 1 orang · terbuka', filledState: 'Terisi', openState: 'Mencari anggota', assigneeFilled: 'Diisi oleh Satria', assigneeOpen: 'Kontributor' }
  ]
  roles.forEach((role) => {
    document.querySelector(role.summary).textContent = unclaimed ? role.open : role.filled
    const state = document.querySelector(role.state)
    state.textContent = unclaimed ? role.openState : role.filledState
    const partiallyFilled = !unclaimed && role.state === '#frontend-role-state'
    state.classList.toggle('filled', !unclaimed && !partiallyFilled)
    state.classList.toggle('open', unclaimed || partiallyFilled)
    document.querySelector(role.assignee).textContent = unclaimed ? role.assigneeOpen : role.assigneeFilled
  })
  document.querySelector('#create-roster-card').classList.toggle('hidden', unclaimed)
  document.querySelector('#unclaimed-roster-note').classList.toggle('hidden', !unclaimed)
  document.querySelector('#owner-commitment-card').classList.toggle('hidden', unclaimed)
  document.querySelector('#lead-commitment-card').classList.toggle('hidden', unclaimed)
  document.querySelector('#unclaimed-commitment-note').classList.toggle('hidden', !unclaimed)
  document.querySelector('#ownership-mode-hint').textContent = unclaimed
    ? 'Project dipublikasikan tanpa owner. Aplikasi contributor terkunci sampai talent yang memenuhi persyaratan mengonfirmasi Claim Project.'
    : 'Talent yang ditunjuk sebagai owner sekaligus lead mengelola aplikasi contributor dan Workspace setelah project dibuka.'
  document.querySelector('#capacity-note').textContent = unclaimed
    ? 'Semua posisi ditampilkan, tetapi aplikasi contributor belum dapat dikirim sampai owner mengklaim project.'
    : 'Anggota terkonfirmasi mengisi kapasitas; undangan yang belum diterima tidak dihitung.'
}

function updateReviewReadiness(unclaimed) {
  document.querySelector('#review-confirmed-count').textContent = unclaimed ? '0 anggota' : '4 anggota'
  document.querySelector('#review-open-positions').textContent = unclaimed ? '5 posisi terbuka' : '1 posisi terbuka'
}

function updateRunState() {
  const unclaimed = isUnclaimedMode() && !ownershipClaimed
  const claiming = isKolaboriaInitiated() && ownershipClaimed && !workspaceReady
  document.querySelector('#unclaimed-state').classList.toggle('hidden', !unclaimed)
  document.querySelector('#claim-success').classList.toggle('hidden', !claiming)
  document.querySelector('#run-grid').classList.toggle('hidden', unclaimed || claiming)
  document.querySelector('#running-footer').classList.toggle('hidden', unclaimed || claiming)
  const claimConfirmationOpen = !document.querySelector('#claim-confirmation').classList.contains('hidden')
  document.querySelector('#claim-project-button').classList.toggle('hidden', !unclaimed || claimConfirmationOpen)
  document.querySelector('#claim-project-button').disabled = !submittedForPublication
  document.querySelector('#running-status-label').textContent = unclaimed
    ? (submittedForPublication ? 'UNCLAIMED · APLIKASI TERTUTUP' : 'PREVIEW · BELUM DIPUBLIKASIKAN')
    : claiming
      ? 'OWNER DITETAPKAN · SIAP MENERIMA APLIKASI'
      : 'BERJALAN · MINGGU 2 DARI 4'
  document.querySelector('#running-header-copy').textContent = unclaimed
    ? 'Project belum memiliki owner. Kolaboria hanya tercatat sebagai pihak yang menginisiasi.'
    : claiming
      ? 'Ownership sudah berpindah ke talent; contributor kini dapat mengajukan diri kepada owner.'
      : 'Tim tahu siapa yang mengambil keputusan, memimpin pekerjaan, dan memberi konteks.'
}

function selectOption(select, value) {
  const option = Array.from(select.options).find((candidate) => candidate.value === value || candidate.textContent.trim() === value)
  if (option) select.value = option.value || option.textContent.trim()
}

function applyContext() {
  const isPlatformInitiated = isKolaboriaInitiated()
  document.querySelector('#ownership-mode-field').classList.toggle('hidden', !isPlatformInitiated)
  if (isPlatformInitiated) {
    selectOption(initiatorType, 'Kolaboria')
    initiatorName.value = 'Kolaboria'
    selectOption(ownerType, 'Individu')
    ownershipMode.value = 'unclaimed'
    ownerIsInitiator.checked = false
    ownerIsInitiator.disabled = true
    selectOption(leadPerson, 'Nabila Putri · Product Lead')
    ownerName.value = 'Nabila Putri'
    leadIsOwner.checked = true
  } else {
    selectOption(initiatorType, 'Individu')
    initiatorName.value = 'Fahmi'
    selectOption(ownerType, 'Individu')
    ownerName.value = 'Fahmi'
    selectOption(leadPerson, 'Nabila Putri · Product Lead')
    ownerIsInitiator.disabled = false
    ownerIsInitiator.checked = true
    leadIsOwner.checked = false
  }
  ownerType.disabled = ownerIsInitiator.checked
  ownerName.disabled = ownerIsInitiator.checked
  leadPerson.disabled = leadIsOwner.checked
  leadIsOwner.disabled = !isPlatformInitiated && ownerType.value !== 'Individu'
  ownershipClaimed = false
  workspaceReady = false
  submittedForPublication = false
  document.querySelector('#submit-result').classList.add('hidden')
  submitButton.textContent = 'Publikasikan project →'
  document.querySelector('#claim-confirmation').classList.add('hidden')
  document.querySelector('#claim-terms').checked = false
  document.querySelector('#confirm-claim-button').disabled = true
  document.querySelector('#review-owner').textContent = 'Belum ditetapkan'
  applyOwnershipMode()
}

function applyOwnershipMode() {
  const unclaimed = isUnclaimedMode()
  ownershipClaimed = false
  workspaceReady = false
  ownerIsInitiator.checked = !isKolaboriaInitiated()
  ownerIsInitiator.disabled = isKolaboriaInitiated()
  ownerType.disabled = unclaimed || isKolaboriaInitiated()
  ownerName.disabled = unclaimed
  leadPerson.disabled = unclaimed || leadIsOwner.checked
  leadIsOwner.disabled = unclaimed
  if (unclaimed) {
    ownerIsInitiator.checked = false
    selectOption(ownerType, 'Individu')
    ownerName.value = 'Belum ditetapkan'
    selectOption(leadPerson, 'Belum ditetapkan')
    leadIsOwner.checked = false
  } else if (isKolaboriaInitiated()) {
    selectOption(ownerType, 'Individu')
    ownerName.value = 'Nabila Putri'
    leadIsOwner.checked = true
    leadPerson.disabled = true
    syncLeadToOwner()
  } else {
    selectOption(ownerType, 'Individu')
    ownerName.value = initiatorName.value
    selectOption(leadPerson, 'Nabila Putri · Product Lead')
    leadIsOwner.checked = false
    ownerType.disabled = true
    ownerName.disabled = true
    leadPerson.disabled = false
  }
  document.querySelector('#owner-is-initiator').closest('.check-line').classList.toggle('hidden', isKolaboriaInitiated())
  document.querySelector('#lead-is-owner').closest('.check-line').classList.toggle('hidden', unclaimed)
  document.querySelector('#owner-commitment-card').classList.toggle('hidden', unclaimed)
  document.querySelector('#lead-commitment-card').classList.toggle('hidden', unclaimed)
  updateIdentityPreview()
}

nextButton.addEventListener('click', () => setStep(currentStep + 1))
backButton.addEventListener('click', () => setStep(currentStep - 1))
document.querySelectorAll('.view-tab').forEach((tab) => {
  tab.addEventListener('click', () => setView(tab.dataset.view))
})

contextSelect.addEventListener('change', applyContext)
ownershipMode.addEventListener('change', () => {
  submittedForPublication = false
  document.querySelector('#submit-result').classList.add('hidden')
  submitButton.textContent = 'Publikasikan project →'
  document.querySelector('#claim-confirmation').classList.add('hidden')
  document.querySelector('#claim-terms').checked = false
  document.querySelector('#confirm-claim-button').disabled = true
  applyOwnershipMode()
})
ownerIsInitiator.addEventListener('change', () => {
  ownerType.disabled = ownerIsInitiator.checked
  ownerName.disabled = ownerIsInitiator.checked
  if (ownerIsInitiator.checked) {
    syncOwnerFromInitiator()
  } else if (contextSelect.value === 'talent') {
    selectOption(ownerType, 'Individu')
    ownerName.value = 'Talent lain yang ditunjuk'
  }
  leadIsOwner.disabled = ownerType.value !== 'Individu'
  if (leadIsOwner.disabled) {
    leadIsOwner.checked = false
    leadPerson.disabled = false
  }
  updateIdentityPreview()
  showToast(ownerIsInitiator.checked ? 'Owner mengikuti identitas inisiator.' : 'Owner dipisahkan dari inisiator.')
})
leadIsOwner.addEventListener('change', () => {
  leadPerson.disabled = leadIsOwner.checked
  if (leadIsOwner.checked) syncLeadToOwner()
  updateIdentityPreview()
  showToast(leadIsOwner.checked ? 'Lead dan owner adalah orang yang sama.' : 'Lead operasional terpisah dari owner.')
})
initiatorName.addEventListener('input', updateIdentityPreview)
initiatorType.addEventListener('change', updateIdentityPreview)
ownerName.addEventListener('input', () => {
  if (isKolaboriaInitiated() && ownershipMode.value === 'designated' && leadIsOwner.checked) syncLeadToOwner()
  updateIdentityPreview()
})
leadPerson.addEventListener('change', updateIdentityPreview)

submitButton.addEventListener('click', () => {
  if (submittedForPublication) {
    setView('running')
    return
  }
  const result = document.querySelector('#submit-result')
  result.classList.remove('hidden')
  const unclaimed = isUnclaimedMode()
  result.querySelector('strong').textContent = unclaimed
    ? 'Project dipublikasikan dengan status UNCLAIMED.'
    : 'Project dipublikasikan. Owner dapat membuka aplikasi.'
  document.querySelector('#submit-result-copy').textContent = unclaimed
    ? 'Belum ada owner. Aplikasi contributor tetap tertutup sampai talent yang memenuhi persyaratan mengonfirmasi Claim Project.'
    : 'Seleksi contributor, Workspace, dan completion dikelola Project Owner sesuai flow existing.'
  submitButton.textContent = 'Lihat status project →'
  submittedForPublication = true
  updateIdentityPreview()
  showToast(unclaimed ? 'Project dipublikasikan sebagai UNCLAIMED.' : 'Project berhasil dipublikasikan.')
})

document.querySelector('#claim-project-button').addEventListener('click', () => {
  if (!submittedForPublication) {
    showToast('Publikasikan project sebagai UNCLAIMED sebelum talent dapat mengklaimnya.')
    return
  }
  document.querySelector('#claim-confirmation').classList.remove('hidden')
  document.querySelector('#claim-project-button').classList.add('hidden')
})
document.querySelector('#claim-terms').addEventListener('change', (event) => {
  document.querySelector('#confirm-claim-button').disabled = !event.target.checked
})
document.querySelector('#confirm-claim-button').addEventListener('click', () => {
  if (!document.querySelector('#claim-terms').checked) return
  ownershipClaimed = true
  ownershipMode.value = 'designated'
  ownerIsInitiator.checked = false
  ownerIsInitiator.disabled = true
  ownerType.disabled = false
  ownerName.disabled = false
  ownerName.value = 'Nabila Putri'
  selectOption(ownerType, 'Individu')
  selectOption(leadPerson, 'Nabila Putri · Product Lead')
  leadIsOwner.checked = true
  leadIsOwner.disabled = false
  leadPerson.disabled = true
  updateIdentityPreview()
  showToast('Claim Project dikonfirmasi. Nabila sekarang memegang ownership.')
})
document.querySelector('#continue-to-workspace').addEventListener('click', () => {
  workspaceReady = true
  syncCapacity()
  updateRunState()
  showToast('Simulasi contributor terpilih. Workspace mengikuti flow existing.')
})

saveButton.addEventListener('click', () => {
  const draft = {
    context: contextSelect.value,
    ownershipStatus: isUnclaimedMode() ? 'UNCLAIMED' : 'DESIGNATED_OWNER',
    title: document.querySelector('#project-title').value,
    initiator: initiatorName.value,
    owner: ownerName.value,
    lead: leadPerson.value,
    confirmedMembers: document.querySelectorAll('#create-roster [data-member-state="confirmed"]').length,
    savedAt: new Date().toISOString()
  }
  try {
    window.sessionStorage.setItem('kolaboria-cold-start-project-draft', JSON.stringify(draft))
    showToast('Draft contoh tersimpan di sesi browser ini.')
  } catch {
    showToast('Penyimpanan sesi browser tidak tersedia.')
  }
})

document.querySelector('#create-roster').addEventListener('click', (event) => {
  const confirmButton = event.target.closest('#confirm-invite, .confirm-roster-invite')
  if (!confirmButton) return
  if (document.querySelectorAll('#create-roster [data-member-state="confirmed"]').length >= totalPositions) {
    showToast('Semua posisi sudah terisi. Undangan ini tetap menunggu sampai ada kapasitas.')
    return
  }
  const row = confirmButton.closest('[data-member-state]')
  row.dataset.memberState = 'confirmed'
  row.classList.remove('pending-roster-row')
  const name = row.querySelector('strong').textContent
  const roleCopy = row.querySelector('small').textContent.replace(' · undangan dikirim', '')
  row.querySelector('small').textContent = `${roleCopy} · bergabung`
  confirmButton.outerHTML = '<span class="roster-status confirmed-status">Terkonfirmasi</span>'
  if (name === 'Dimas') {
    const runningMember = document.querySelector('#running-pending-member')
    runningMember.classList.remove('hidden')
    runningMember.querySelector('small').textContent = `${roleCopy} · 2 dari 2 posisi`
    runningMember.querySelector('.member-state').textContent = 'Aktif'
    runningMember.querySelector('.member-state').classList.remove('pending-text')
  } else {
    const runningRow = document.createElement('div')
    runningRow.className = 'member-row'
    const avatar = document.createElement('span')
    avatar.className = 'member-avatar avatar-pending'
    avatar.textContent = name.slice(0, 1).toUpperCase()
    const person = document.createElement('div')
    const personName = document.createElement('strong')
    personName.textContent = name
    const role = document.createElement('small')
    role.textContent = roleCopy
    const active = document.createElement('span')
    active.className = 'member-state'
    active.textContent = 'Aktif'
    person.append(personName, role)
    runningRow.append(avatar, person, active)
    document.querySelector('.team-panel .member-list').append(runningRow)
  }
  syncCapacity()
  showToast(`${name} dikonfirmasi bergabung. Kapasitas tim diperbarui.`)
})

document.querySelector('#add-member').addEventListener('click', () => {
  const name = window.prompt('Nama anggota yang sudah terlibat atau diundang')
  if (!name?.trim()) return
  const role = window.prompt('Role yang diisi atau diundang', 'Frontend Developer')
  if (!role?.trim()) return
  const row = document.createElement('div')
  row.className = 'roster-row pending-roster-row'
  row.dataset.memberState = 'pending'
  const avatar = document.createElement('span')
  avatar.className = 'member-avatar avatar-pending'
  avatar.textContent = name.trim().slice(0, 1).toUpperCase()
  const person = document.createElement('div')
  const personName = document.createElement('strong')
  personName.textContent = name.trim()
  const personRole = document.createElement('small')
  personRole.textContent = `${role.trim()} · undangan dikirim`
  person.append(personName, personRole)
  const confirm = document.createElement('button')
  confirm.type = 'button'
  confirm.className = 'roster-status pending-status confirm-roster-invite'
  confirm.textContent = 'Menunggu · konfirmasi'
  row.append(avatar, person, confirm)
  document.querySelector('#create-roster').append(row)
  showToast('Anggota ditambahkan sebagai undangan; belum mengisi kapasitas.')
})
document.querySelector('.note-close').addEventListener('click', () => document.querySelector('.prototype-note').remove())
document.querySelector('#back-to-review').addEventListener('click', () => {
  setView('create')
  setStep(4)
})

document.querySelector('#show-responsibilities').addEventListener('click', () => {
  document.querySelector('#responsibility-panel').scrollIntoView({ behavior: 'smooth', block: 'center' })
  document.querySelector('#responsibility-panel').classList.add('attention')
  window.setTimeout(() => document.querySelector('#responsibility-panel').classList.remove('attention'), 900)
})

document.querySelectorAll('.milestone-row input').forEach((input) => {
  input.addEventListener('change', () => {
    input.closest('.milestone-row').classList.toggle('complete', input.checked)
    const completed = document.querySelectorAll('.milestone-row.complete').length
    document.querySelector('.progress-caption span:first-child').textContent = completed + ' dari 4 milestone selesai'
    document.querySelector('.progress-track span').style.width = Math.round((completed / 4) * 100) + '%'
    showToast(input.checked ? 'Milestone ditandai selesai.' : 'Milestone dibuka kembali.')
  })
})

document.querySelector('#complete-project').addEventListener('click', () => {
  document.querySelector('#completion-dialog').showModal()
})
document.querySelector('#show-completion').addEventListener('click', () => {
  document.querySelector('#completion-dialog').showModal()
})
document.querySelector('#add-milestone').addEventListener('click', () => showToast('Di produk, lead dapat menambah milestone sesuai scope tim.'))
document.querySelector('#add-role').addEventListener('click', () => showToast('Di produk, tambahkan role yang benar-benar dibutuhkan untuk hasil ini.'))

document.querySelector('#project-title').addEventListener('input', updateIdentityPreview)
document.querySelector('#outcome').addEventListener('input', (event) => {
  document.querySelector('#preview-outcome').textContent = event.target.value || 'Hasil project akan tampil di sini.'
})

syncCapacity()
applyContext()
