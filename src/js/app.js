const modules = {
  dashboard: async () => {
    const data = await window.api.db('getDashboard');
    return `<div class='card'><h3>Total Vouchers: ${data.voucherCount}</h3><p>Total Amount: ${Number(data.totalAmount).toFixed(2)}</p></div>`;
  },
  create: async () => {
    const pcvNo = await window.api.db('getNextPcvNo');
    return `<div class='card'><h3>Create PCV</h3><div class='row'><input id='pcvNo' value='${pcvNo}' readonly><input id='voucherDate' type='date'></div><div class='row'><input id='paidTo' placeholder='Paid To'><input id='remarks' placeholder='Remarks'></div><div id='entries'></div><button class='btn' id='addEntry'>Add Entry</button> <button class='btn' id='saveVoucher'>Save</button></div>`;
  },
  records: async () => {
    const rows = await window.api.db('listVouchers', '');
    return `<div class='card'><h3>PCV Records</h3><table><tr><th>PCV No</th><th>Date</th><th>Paid To</th><th>Amount</th></tr>${rows.map(r=>`<tr><td>${r.pcv_no}</td><td>${r.voucher_date}</td><td>${r.paid_to}</td><td>${r.total_amount}</td></tr>`).join('')}</table></div>`;
  },
  replenishment: async ()=> `<div class='card'><h3>Replenishment</h3><p>Usage alerts: 40% warning, 50% critical.</p></div>`,
  reports: async ()=> `<div class='card'><h3>Reports</h3><p>CSV/Excel/PDF export hooks ready.</p></div>`,
  settings: async ()=> `<div class='card'><h3>Settings</h3><p>Account codes and signatories management.</p></div>`,
  backup: async ()=> `<div class='card'><h3>Backup & Restore</h3><button class='btn' id='backupBtn'>Create Backup</button> <button class='btn' id='restoreBtn'>Restore Backup</button><p id='backupMsg'></p></div>`
};
const navItems = [['dashboard','Dashboard'],['create','Create PCV'],['records','PCV Records'],['replenishment','Replenishment'],['reports','Reports'],['settings','Settings'],['backup','Backup/Restore']];
const nav = document.getElementById('nav'); const view = document.getElementById('view'); const title = document.getElementById('title');
nav.innerHTML = navItems.map(([k,l])=>`<div><button class='btn' data-k='${k}' style='width:100%;margin:4px 0'>${l}</button></div>`).join('');
async function render(key){ title.textContent = navItems.find(n=>n[0]===key)[1]; view.innerHTML = await modules[key](); bind(key);} 
function bind(key){
  if(key==='backup'){document.getElementById('backupBtn').onclick=async()=>document.getElementById('backupMsg').textContent=`Saved: ${await window.api.createBackup()}`;document.getElementById('restoreBtn').onclick=async()=>document.getElementById('backupMsg').textContent=`Restored: ${await window.api.restoreBackup()||'Cancelled'}`;}
  if(key==='create'){
    const entries = document.getElementById('entries');
    const add=()=>{const d=document.createElement('div');d.className='row';d.innerHTML=`<input placeholder='Account Code' class='acc'><input placeholder='Description' class='desc'><input placeholder='Debit' class='debit' type='number' step='0.01'>`;entries.appendChild(d)};add();
    document.getElementById('addEntry').onclick=add;
    document.getElementById('saveVoucher').onclick=async()=>{const list=[...document.querySelectorAll('#entries .row')].map(r=>({account_code:r.querySelector('.acc').value,description:r.querySelector('.desc').value,debit:Number(r.querySelector('.debit').value||0),credit:0}));const total=list.reduce((a,b)=>a+b.debit,0);await window.api.db('saveVoucher',{pcv_no:pcvNo.value,voucher_date:voucherDate.value,paid_to:paidTo.value,remarks:remarks.value,total_amount:total},list);alert('Voucher saved');};
  }
}
nav.onclick=(e)=>{if(e.target.dataset.k)render(e.target.dataset.k)};
render('dashboard');
