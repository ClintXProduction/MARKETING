let cart=JSON.parse(localStorage.getItem('cltx4_cart')||'[]'),currentProduct=null;
const $=id=>document.getElementById(id);
function peso(n){return"₱"+Number(n).toLocaleString("en-PH")}
function esc(x){return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function openLink(url){window.open(url,"_blank","noopener");}
function render(){let q=$("search").value.toLowerCase().trim(),a=PRODUCTS.filter(p=>(p.name+" "+p.category+" "+p.description).toLowerCase().includes(q));let s=$("sort").value;if(s==="low")a.sort((x,y)=>x.price-y.price);if(s==="high")a.sort((x,y)=>y.price-x.price);$("resultCount").textContent=a.length;$("empty").hidden=a.length>0;$("products").innerHTML=a.map(p=>`<article class="card"><img src="${p.image}" alt="${esc(p.name)}"><div class="cardBody"><div class="tag">${esc(p.category)}</div><h3>${esc(p.name)}</h3><div class="price">${peso(p.price)}</div><p class="desc">${esc(p.description)}</p><div class="stock">● ${esc(p.stock)}</div><button class="secondary" onclick="openProduct('${p.id}')">View product</button></div></article>`).join("")}
function openProduct(id){let p=PRODUCTS.find(x=>x.id===id);currentProduct=p;$("dImg").src=p.image;$("dName").textContent=p.name;$("dCategory").textContent=p.category;$("dPrice").textContent=peso(p.price);$("dDesc").textContent=p.description;$("dStock").textContent="● "+p.stock;$("inquire").onclick=()=>showContact(p);$("addBtn").onclick=()=>{if(!cart.includes(p.id))cart.push(p.id);updateCart();productDialog.close()};productDialog.showModal()}
function showContact(p){currentProduct=p;$("contactTitle").textContent=p?`Inquiry: ${p.name}`:"CLTX4 Inquiry";contactDialog.showModal()}
function openEmailInquiry(product){
  const subject=product?`CLTX4 Product Inquiry — ${product.name}`:"CLTX4 Product Inquiry";
  let lines=["Hi CLTX4! I'd like to inquire about:"];
  if(product){lines.push("",`Product: ${product.name}`,`Price: ${peso(product.price)}`,`Product ID: ${product.id}`);}
  if(cart.length){
    lines.push("","Selected items:");
    cart.forEach(id=>{const p=PRODUCTS.find(x=>x.id===id);if(p)lines.push(`• ${p.name} — ${peso(p.price)}`);});
  }
  lines.push("","","Thank you!");
  window.location.href=`mailto:bracenoclint@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
function copyText(text,label){
  navigator.clipboard?.writeText(text).then(()=>toast(label+" copied!")).catch(()=>alert(text));
}
function toast(message){
  let t=document.getElementById("toast"); if(!t){t=document.createElement("div");t.id="toast";document.body.appendChild(t);}
  t.textContent=message;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800);
}
function showPayment(type){if(type==="gcash"){$("paymentBody").innerHTML=`<p class="tag">GCASH PAYMENT</p><h2>Scan to Pay</h2><img class="qr" src="gcash-qr.jpg" alt="GCash QR Code"><p class="center"><b>CP Number: 09661821176</b></p><p class="center">CLINT PIO</p><button class="secondary wide" onclick="copyText('09661821176','GCash number')">📋 Copy number</button>`;paymentDialog.showModal()}else{$("paymentBody").innerHTML=`<p class="tag">PAYPAL</p><h2>PayPal</h2><p class="bigEmail">bracenoclint@gmail.com</p><button class="secondary wide" onclick="copyText('bracenoclint@gmail.com','PayPal email')">📋 Copy email</button><button class="primary wide" onclick="openEmailInquiry(currentProduct)">✉️ Email inquiry</button>`;paymentDialog.showModal()}}
function updateCart(){localStorage.setItem('cltx4_cart',JSON.stringify(cart));$("cartCount").textContent=cart.length;$("cartItems").innerHTML=cart.length?cart.map(id=>{let p=PRODUCTS.find(x=>x.id===id);return`<div class="option"><span>${esc(p.name)}<br>${peso(p.price)}</span><button onclick="cart=cart.filter(x=>x!=='${id}');updateCart()">Remove</button></div>`}).join(""):"<p>No items selected.</p>";$("cartInquire").onclick=()=>showContact()}
function showContact(p){currentProduct=p;$("contactTitle").textContent=p?`Inquiry: ${p.name}`:"CLTX4 Inquiry";contactDialog.showModal()}
$("search").addEventListener("input",render);$("sort").addEventListener("change",render);$("cartBtn").onclick=()=>{updateCart();cartDialog.showModal()};render();updateCart();
setInterval(()=>{const e=document.getElementById('liveClock');if(e)e.textContent=new Date().toLocaleTimeString([], {hour12:false});},1000);
