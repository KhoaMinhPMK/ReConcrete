;(function(){
  const warehouses = [
    { id: 'wh-hcm', name: 'Kho Hồ Chí Minh', address: 'KCN Tân Bình, TP.HCM' },
    { id: 'wh-dn', name: 'Kho Đà Nẵng', address: 'Q. Liên Chiểu, Đà Nẵng' },
    { id: 'wh-hn', name: 'Kho Hà Nội', address: 'KCN Bắc Thăng Long, Hà Nội' }
  ]

  const samples = [
    {
      id: 'sp-long-001', type: 'sample', shape: 'trụ dài', name: 'Trụ dài D150x300',
      specs: { diameter_mm: 150, length_mm: 300 },
      description: 'Mẫu trụ dài dùng cho gia cố mái dốc, bờ kênh.',
      certificate: 'TCVN',
      inventory: [
        { warehouseId: 'wh-hcm', quantity: 120 },
        { warehouseId: 'wh-dn', quantity: 40 }
      ]
    },
    {
      id: 'sp-short-002', type: 'sample', shape: 'trụ ngắn', name: 'Trụ ngắn D100x150',
      specs: { diameter_mm: 100, length_mm: 150 },
      description: 'Mẫu trụ ngắn phù hợp lót nền chống xói.',
      certificate: 'TCVN',
      inventory: [
        { warehouseId: 'wh-hcm', quantity: 300 },
        { warehouseId: 'wh-hn', quantity: 150 }
      ]
    },
    {
      id: 'sp-box-003', type: 'sample', shape: 'hình hộp', name: 'Khối hộp 150x150x150',
      specs: { width_mm: 150, height_mm: 150, length_mm: 300 },
      description: 'Khối hộp cho gia cố nền tại bờ kè.',
      certificate: 'TCVN',
      inventory: [
        { warehouseId: 'wh-dn', quantity: 80 },
        { warehouseId: 'wh-hn', quantity: 50 }
      ]
    }
  ]

  const designs = [
    {
      id: 'ds-slope-01', type: 'design', name: 'Thiết kế gia cố mái dốc',
      description: 'Bố trí mẫu trụ dài theo ma trận tam giác để phân tán tải.',
      specs: { module: '1.5m x 1.5m', thickness_mm: 300 },
      need_confirm_from: '@Nguyen Huong Lan',
      certificate: 'Consultant Structural Review v1.0',
      warehouses: [
        { warehouseId: 'wh-hcm', quantity: 20 },
        { warehouseId: 'wh-dn', quantity: 10 }
      ]
    },
    {
      id: 'ds-canal-02', type: 'design', name: 'Thiết kế bờ kênh chống xói',
      description: 'Dùng khối hộp và trụ ngắn xen kẽ tạo bề mặt thô giảm vận tốc dòng.',
      specs: { module: '2m x 2m', thickness_mm: 250 },
      need_confirm_from: '@Nguyen Huong Lan',
      certificate: 'Hydraulic Concept Approval',
      warehouses: [
        { warehouseId: 'wh-hn', quantity: 8 }
      ]
    }
  ]

  function computeTotals(){
    const long = samples.filter(s=>s.shape==='trụ dài').reduce((n,s)=>n + s.inventory.reduce((m,i)=>m+i.quantity,0),0)
    const short = samples.filter(s=>s.shape==='trụ ngắn').reduce((n,s)=>n + s.inventory.reduce((m,i)=>m+i.quantity,0),0)
    const box = samples.filter(s=>s.shape==='hình hộp').reduce((n,s)=>n + s.inventory.reduce((m,i)=>m+i.quantity,0),0)
    return { long, short, box, designCount: designs.length }
  }

  window.__DATA__ = { warehouses, samples, designs, computeTotals }
})()


