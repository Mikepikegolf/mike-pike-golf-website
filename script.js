document.querySelector('.menu')?.addEventListener('click',()=>{let el=document.querySelector('.links');el.classList.toggle('open');document.querySelector('.menu').setAttribute('aria-expanded',el.classList.contains('open'))});const form=document.querySelector('#requestForm');if(form){const qs=new URLSearchParams(location.search);if(qs.get('service')){const sel=form.querySelector('#service');if([...sel.options].some(o=>o.value===qs.get('service')))sel.value=qs.get('service');}const date=form.querySelector('#date'),time=form.querySelector('#time'),status=form.querySelector('#status');const today=new Date();const localISO=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;date.min=localISO(today);let end=new Date(today.getFullYear(),today.getMonth(),today.getDate()+30);date.max=localISO(end);function update(){let day=date.value?new Date(date.value+'T12:00:00').getDay():-1;let evening=time.querySelector('option[value="Evening"]');evening.disabled=day!==1&&day!==4;if(evening.disabled&&time.value==='Evening')time.value='Flexible';status.textContent=day===0?'Sunday appointments are unavailable. Please choose Monday through Saturday.':''}date.addEventListener('change',update);update();form.addEventListener('submit',async e=>{
  e.preventDefault();
  update();
  const day=date.value?new Date(date.value+'T12:00:00').getDay():-1;
  if(day===0||!form.reportValidity()){
    status.textContent='Please choose a valid date and complete the required fields.';
    return;
  }
  const button=form.querySelector('button[type="submit"]');
  button.disabled=true;
  button.textContent='Sending…';
  status.className='form-status';
  status.textContent='Sending your request…';
  const data=new FormData(form);
  data.append('_subject','Mike Pike Golf — Appointment Request');
  data.append('_captcha','true');
  data.append('_template','table');
  try{
    const response=await fetch('https://formsubmit.co/ajax/mikepikegolf@gmail.com',{
      method:'POST',
      body:data,
      headers:{'Accept':'application/json'}
    });
    const result=await response.json();
    if(!response.ok||result.success===false||result.success==='false')throw new Error('Submission not accepted');
    form.reset();
    update();
    status.className='form-status form-status--success';
    status.innerHTML='<span class="form-status__icon" aria-hidden="true">✓</span><h3>Appointment Request Sent!</h3><p>Thank you for contacting Mike Pike Golf.</p><p>Your request has been received. Mike will contact you personally to confirm your appointment.</p><p><strong>Your appointment is not yet confirmed.</strong></p>';
    status.scrollIntoView({behavior:'smooth',block:'center'});
    status.focus({preventScroll:true});
  }catch(err){
    status.className='form-status form-status--error';
    status.textContent='Your request could not be sent. Please email mikepikegolf@gmail.com directly.';
  }finally{
    button.disabled=false;
    button.textContent='Send Appointment Request';
  }
})}
