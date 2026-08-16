const photoCatalog = window.FARMHOUSE_PHOTOS || [];
let selectedPhoto = photoCatalog[0] || { code:'FF-PH-001', title:'Lakeside Overlook', spriteIndex:0 };

function spritePosition(index){
  const col=index%6, row=Math.floor(index/6);
  const x=col===5?100:(col/5)*100;
  const y=row===9?100:(row/9)*100;
  return `${x}% ${y}%`;
}
function applySprite(el,index){ if(!el) return; el.style.backgroundPosition=spritePosition(index||0); el.dataset.photoIndex=index||0; }
function selectPhoto(photo, scrollToShop=false){
  selectedPhoto = photo;
  const codeInput=document.getElementById('photoCode');
  if(codeInput) codeInput.value=`${photo.code} — ${photo.title}`;
  const title=document.getElementById('selectedPhotoTitle');
  const code=document.getElementById('selectedPhotoCode');
  const preview=document.getElementById('productPreview');
  const caption=document.getElementById('previewCaption');
  if(title) title.textContent=photo.title;
  if(code) code.textContent=photo.code;
  if(preview){ applySprite(preview,photo.spriteIndex); preview.setAttribute('aria-label',`${photo.title} — Farmhouse Frames photography`); }
  if(caption) caption.textContent=`${photo.code} — ${photo.title}`;
  document.querySelectorAll('.photo-card').forEach(el=>el.classList.toggle('selected',el.dataset.code===photo.code));
  if(scrollToShop) document.getElementById('shop')?.scrollIntoView({behavior:'smooth'});
}
let activePhotoCategory = 'All';
function renderGalleryFilters(){
  const filters=document.getElementById('galleryFilters'); if(!filters) return;
  const categories=['All', ...new Set(photoCatalog.map(photo=>photo.category).filter(Boolean))];
  filters.innerHTML='';
  categories.forEach(category=>{const button=document.createElement('button');button.type='button';button.className='filter-chip'+(category===activePhotoCategory?' active':'');button.textContent=category;button.addEventListener('click',()=>{activePhotoCategory=category;renderGalleryFilters();renderPhotoGallery();});filters.appendChild(button);});
}
function renderPhotoGallery(){
  const gallery=document.getElementById('photoGallery'); if(!gallery) return; gallery.innerHTML='';
  const visible=activePhotoCategory==='All'?photoCatalog:photoCatalog.filter(photo=>photo.category===activePhotoCategory);
  visible.forEach(photo=>{const card=document.createElement('button');card.type='button';card.className='photo-card'+(photo.code===selectedPhoto.code?' selected':'');card.dataset.code=photo.code;card.innerHTML=`<span class="photo-thumb" role="img" aria-label="${photo.title} — Farmhouse Frames" style="background-position:${spritePosition(photo.spriteIndex)}"></span><span class="photo-card-copy"><strong>${photo.title}</strong><span>${photo.code}</span><small>${photo.category||''}</small></span>`;card.addEventListener('click',()=>selectPhoto(photo,true));gallery.appendChild(card);});
}
const canvasSizes=[{sku:'FF-CAN-0808',size:'8 × 8',price:24.99},{sku:'FF-CAN-1008',size:'10 × 8',price:34.99},{sku:'FF-CAN-1212',size:'12 × 12',price:44.99},{sku:'FF-CAN-1114',size:'11 × 14',price:44.99},{sku:'FF-CAN-1620',size:'16 × 20',price:54.99},{sku:'FF-CAN-2418',size:'24 × 18',price:64.99}];
const state={selected:canvasSizes[2],cart:JSON.parse(localStorage.getItem('ff-cart')||'[]')};
const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
function renderSizes(){const grid=document.getElementById('sizeGrid');grid.innerHTML='';canvasSizes.forEach(item=>{const btn=document.createElement('button');btn.type='button';btn.className='size-option'+(item.sku===state.selected.sku?' active':'');btn.innerHTML=`<span>${item.size}</span><strong>${money(item.price)}</strong>`;btn.addEventListener('click',()=>{state.selected=item;document.getElementById('selectedPrice').textContent=money(item.price);renderSizes();});grid.appendChild(btn);});}
function saveCart(){localStorage.setItem('ff-cart',JSON.stringify(state.cart));renderCart();}
function addCanvas(){const photoCode=document.getElementById('photoCode').value.trim()||`${selectedPhoto.code} — ${selectedPhoto.title}`;state.cart.push({id:`${Date.now()}`,sku:state.selected.sku,name:'Signature Local Canvas Print',size:state.selected.size,price:state.selected.price,photoCode,qty:1});saveCart();openCart();}
function removeItem(id){state.cart=state.cart.filter(i=>i.id!==id);saveCart();}
function renderCart(){const items=document.getElementById('cartItems'),empty=document.getElementById('cartEmpty');items.innerHTML='';state.cart.forEach(item=>{const el=document.createElement('div');el.className='cart-line';el.innerHTML=`<div><strong>${item.name}</strong><span>${item.size} • ${item.photoCode}</span><small>${item.sku}</small></div><div><b>${money(item.price)}</b><button type="button">Remove</button></div>`;el.querySelector('button').addEventListener('click',()=>removeItem(item.id));items.appendChild(el);});empty.style.display=state.cart.length?'none':'block';document.getElementById('cartCount').textContent=state.cart.length;document.getElementById('cartSubtotal').textContent=money(state.cart.reduce((s,i)=>s+i.price*i.qty,0));}
function openCart(){document.getElementById('cartDrawer').classList.add('open');document.getElementById('cartBackdrop').classList.add('show');document.getElementById('cartDrawer').setAttribute('aria-hidden','false');}
function closeCart(){document.getElementById('cartDrawer').classList.remove('open');document.getElementById('cartBackdrop').classList.remove('show');document.getElementById('cartDrawer').setAttribute('aria-hidden','true');}
function checkout(){if(!state.cart.length)return;const url=window.FARMHOUSE_FRAMES_CONFIG?.stripeCheckoutUrl;if(url)window.location.href=url;else document.getElementById('checkoutNote').textContent='Cart is ready. Add the live Stripe Checkout or Payment Link in config.js before public launch.';}
const menu=document.querySelector('.menu-toggle');menu.addEventListener('click',()=>{const nav=document.querySelector('.nav');nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'));});
document.getElementById('addCanvas').addEventListener('click',addCanvas);document.getElementById('openCart').addEventListener('click',openCart);document.getElementById('closeCart').addEventListener('click',closeCart);document.getElementById('cartBackdrop').addEventListener('click',closeCart);document.getElementById('checkoutButton').addEventListener('click',checkout);
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget),email=window.FARMHOUSE_FRAMES_CONFIG?.contactEmail;const subject=encodeURIComponent(`Farmhouse Frames — ${data.get('interest')}`);const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nInterest: ${data.get('interest')}\n\n${data.get('message')}`);if(email)window.location.href=`mailto:${email}?subject=${subject}&body=${body}`;else document.getElementById('formNote').textContent='Message prepared. Add your Farmhouse Frames business email in config.js to make this form send by email.';});
document.getElementById('year').textContent=new Date().getFullYear();document.querySelectorAll('.sprite-photo[data-photo-index]').forEach(el=>applySprite(el,Number(el.dataset.photoIndex)));renderGalleryFilters();renderPhotoGallery();selectPhoto(selectedPhoto);renderSizes();renderCart();