;(function(){
  const { warehouses, samples, designs, computeTotals } = window.__DATA__ || { warehouses:[], samples:[], designs:[], computeTotals:()=>({}) }

  function qs(sel){ return document.querySelector(sel) }
  function qsa(sel){ return Array.from(document.querySelectorAll(sel)) }
  function fmtQty(n){ return new Intl.NumberFormat('vi-VN').format(n||0) }
  function getParam(key){ return new URLSearchParams(location.search).get(key) }
  function findWarehouse(id){ return warehouses.find(w=>w.id===id) }

  // Map ảnh nội bộ cho item
  function getItemImage(item){
    if(!item) return '../img/6.jpg'
    if(item.type === 'design'){
      if(item.id && item.id.includes('slope')) return '../img/4.png'
      if(item.id && item.id.includes('canal')) return '../img/5.png'
      return '../img/4.png'
    }
    const shape = (item.shape||'').toLowerCase()
    if(shape.includes('trụ dài')) return '../img/1.png'
    if(shape.includes('trụ ngắn')) return '../img/2.png'
    if(shape.includes('hình hộp')) return '../img/3.png'
    return '../img/6.jpg'
  }

  function renderCard(item){
    const isDesign = item.type==='design'
    const total = isDesign
      ? (item.warehouses||[]).reduce((n,x)=>n+x.quantity,0)
      : (item.inventory||[]).reduce((n,x)=>n+x.quantity,0)
    const href = isDesign ? `detail-design.html?id=${item.id}` : `detail-sample.html?id=${item.id}`
    const icon = isDesign ? 'fa-palette' : (item.shape==='hình hộp' ? 'fa-square' : (item.shape==='trụ dài' ? 'fa-circle' : 'fa-circle-dot'))
    const img = getItemImage(item)
    return `
      <div class="card">
        <div class="thumb">
          <img src="${img}" alt="${item.name}"/>
          <i class="fa-solid ${icon}"></i>
        </div>
        <div class="content">
          <div class="title">${item.name}</div>
          <div class="meta">${isDesign ? 'Thiết kế' : `Bê tông mẫu • ${item.shape||''}`}</div>
          <div class="price">SL: ${fmtQty(total)}</div>
        </div>
        <div class="actions"><a href="${href}">Xem chi tiết</a><span class="badge">${item.certificate||'—'}</span></div>
      </div>
    `
  }

  function renderDetailSample(sample){
    const specs = sample.specs||{}
    const dims = sample.shape==='hình hộp'
      ? `${specs.width_mm||'-'} x ${specs.height_mm||'-'} x ${specs.length_mm||'-'} mm`
      : `D${specs.diameter_mm||'-'} x ${specs.length_mm||specs.height_mm||'-'} mm`
    const inv = (sample.inventory||[]).map(x=>{
      const w = findWarehouse(x.warehouseId)
      return `<li>${w?.name||x.warehouseId} — SL: ${fmtQty(x.quantity)} (${w?.address||''})</li>`
    }).join('')
    const img = getItemImage(sample)
    return `
      <div class="panel">
        <div class="detail-thumb"><img src="${img}" alt="${sample.name}"></div>
        <h2>${sample.name}</h2>
        <p class="meta">${sample.shape} • <span class="badge">${sample.certificate||'—'}</span></p>
        <p>${sample.description||''}</p>
      </div>
      <div class="panel">
        <h3>Kích thước</h3>
        <p>${dims}</p>
        <h3>Kho & Số lượng</h3>
        <ul class="list">${inv}</ul>
      </div>
    `
  }

  function renderDetailDesign(design){
    const wh = (design.warehouses||[]).map(x=>{
      const w = findWarehouse(x.warehouseId)
      return `<li>${w?.name||x.warehouseId} — SL: ${fmtQty(x.quantity)} (${w?.address||''})</li>`
    }).join('')
    const img = getItemImage(design)
    return `
      <div class="panel">
        <div class="detail-thumb"><img src="${img}" alt="${design.name}"></div>
        <h2>${design.name}</h2>
        <p class="meta">Thiết kế • <span class="badge">${design.certificate||'—'}</span></p>
        <p>${design.description||''}</p>
        <p class="meta">Cần xác nhận thêm từ ${design.need_confirm_from||'—'} về nội dung nên bổ sung.</p>
      </div>
      <div class="panel">
        <h3>Thông số</h3>
        <p>Module: ${design.specs?.module||'—'}; Chiều dày: ${design.specs?.thickness_mm||'—'} mm</p>
        <h3>Kho & Số lượng</h3>
        <ul class="list">${wh}</ul>
      </div>
    `
  }

  function initHome(){
    // nothing special for now
  }

  function initInventory(){
    const totals = computeTotals()
    qs('#qty-long').textContent = fmtQty(totals.long)
    qs('#qty-short').textContent = fmtQty(totals.short)
    qs('#qty-box').textContent = fmtQty(totals.box)
    qs('#qty-design').textContent = fmtQty(totals.designCount)

    const grid = qs('#grid')
    const allItems = [...samples, ...designs]

    function applyRender(){
      const term = (qs('#search').value||'').toLowerCase()
      const type = qs('#typeFilter').value
      const filtered = allItems.filter(it=>{
        const inType = type==='all' ? true : it.type===type
        const text = `${it.name} ${it.id} ${it.certificate||''} ${it.shape||''}`.toLowerCase()
        return inType && text.includes(term)
      })
      grid.innerHTML = filtered.map(renderCard).join('') || '<p class="meta">Không có mục phù hợp.</p>'
    }

    qsa('#search, #typeFilter').forEach(el=>el.addEventListener('input', applyRender))
    applyRender()
  }

  function initDetailSample(){
    const id = getParam('id')
    const sample = samples.find(s=>s.id===id)
    if(!sample){ qs('#detail').innerHTML = '<p class="meta">Không tìm thấy mẫu.</p>'; return }
    qs('#detail').innerHTML = renderDetailSample(sample)
  }

  function initDetailDesign(){
    const id = getParam('id')
    const design = designs.find(d=>d.id===id)
    if(!design){ qs('#detail').innerHTML = '<p class="meta">Không tìm thấy thiết kế.</p>'; return }
    qs('#detail').innerHTML = renderDetailDesign(design)
  }

  window.initHome = initHome
  window.initInventory = initInventory
  window.initDetailSample = initDetailSample
  window.initDetailDesign = initDetailDesign
})()


