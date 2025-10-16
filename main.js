// Khai báo các biến toàn cục
let camera,scene,renderer,cssRenderer,controls;
const objects=[]; 
const targets={table:[],sphere:[],helix:[],grid:[]}; 

// 🚨 KHAI BÁO BIẾN MỚI CHO FOCUS 3D 🚨
const detailObjects = []; // Mảng chứa các nhãn 3D (Thông số)
let isFocused = false;    // Trạng thái đang tập trung
// Hằng số kích thước
const SIZE=100; 
let targetPosition = new THREE.Vector3(0, 0, 0); // Vị trí trung tâm màn hình 3D (Focus Target)

// 💡 HÀM CHUYỂN ĐỔI SỐ THÀNH SỐ LA MÃ
function toRoman(num) {
    if (typeof num !== 'number') return num;
    const lookup = { 1000: 'M', 900: 'CM', 500: 'D', 400: 'CD', 100: 'C', 90: 'XC', 50: 'L', 40: 'XL', 10: 'X', 9: 'IX', 5: 'V', 4: 'IV', 1: 'I' };
    let roman = '';
    for (const i in lookup) {
        while (num >= parseInt(i)) {
            roman += lookup[i];
            num -= parseInt(i);
        }
    }
    return roman;
}

// 💡 HÀM CHUYỂN ĐỔI NHÓM SANG KÝ HIỆU LA MÃ (ví dụ: 1 -> IA, 13 -> IIIA)
function getRomanGroup(group) {
    if (group === 18) return 'VIIIA';
    if (group >= 3 && group <= 12) {
        // Nhóm B (Kim loại chuyển tiếp)
        if (group === 12) return 'IIB';
        if (group === 11) return 'IB';
        if (group === 10) return 'VIIIB';
        if (group === 9) return 'VIIIB';
        if (group === 8) return 'VIIIB';
        if (group === 7) return 'VIIB';
        if (group === 6) return 'VIB';
        if (group === 5) return 'VB';
        if (group === 4) return 'IVB';
        if (group === 3) return 'IIIB';
    } else {
        // Nhóm A (Nhóm chính)
        if (group === 1) return 'IA';
        if (group === 2) return 'IIA';
        if (group === 13) return 'IIIA';
        if (group === 14) return 'IVA';
        if (group === 15) return 'VA';
        if (group === 16) return 'VIA';
        if (group === 17) return 'VIIA';
    }
    return group; // Mặc định trả về số
}

// Hàm gán màu dựa trên mã nhóm
function getGroupColor(groupCode){
    switch(groupCode){
        case 1:  
        case 2:  
        case 4:  
             return 'rgba(0, 170, 255, 0.86)';   // Xanh Blue (Kim loại)

        case 3:  
             return 'rgba(255, 183, 0, 0.8)';  // Cam Vàng (Kim loại Chuyển tiếp)

        case 6:  
        case 7:  
        case 5:  
             return 'rgba(224, 92, 20, 0.84)';   // Đỏ (Phi kim/Á kim)

        case 8:  
             return 'rgba(7, 231, 93, 0.8)';   // Xanh Lá Cây (Khí hiếm)

        case 9:  
             return 'rgba(255, 183, 0, 0.8)';
        default: return 'rgba(255, 183, 0, 0.8)';
    }
}

// HÀM: Thoát khỏi chế độ tập trung 
function unfocusElements(){
    if (!isFocused) return;
    
    // 1. Dịch chuyển Camera về vị trí ban đầu
    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 0, z: 2800 }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        // CHỈ GỌI TRANSFORM SAU KHI CAMERA ĐÃ QUAY VỀ
        .onComplete(() => {
            // 2. Quay lại bố cục TABLE (Hình Chữ Nhật) 
            transform(targets.table, 1500); 
        })
        .start();

    // 3. Đặt lại kích thước, độ trong suốt, và vị trí cho tất cả các ô
    for (const object of objects) {
        
        // Trả về kích thước và độ trong suốt ban đầu
        new TWEEN.Tween(object.element.style)
            .to({ width: '280px', height: '280px', opacity: 1 }, 1000) 
            .easing(TWEEN.Easing.Cubic.InOut)
            .onComplete(() => {
                object.element.style.width = '280px';
                object.element.style.height = '280px';
                object.element.style.opacity = '1';
                // Đảm bảo các ô ẩn quay lại
                object.scale.set(1, 1, 1);
            })
            .start();
            
        // Đảm bảo ô được focus quay lại vị trí table ban đầu
        if(object.userData.focused){
             delete object.userData.focused;
        }

        // Đảm bảo các ô ẩn quay lại scale 1
        if(object.userData.hidden){
            new TWEEN.Tween(object.scale)
                .to({x: 1, y: 1, z: 1}, 1000)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
            new TWEEN.Tween(object.element.style)
                .to({ opacity: 1 }, 1000)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
            delete object.userData.hidden;
        }
    }
    
    // 4. Xóa các nhãn chi tiết
    for (const detailObject of detailObjects) {
        scene.remove(detailObject);
    }
    detailObjects.length = 0; 
    
    // 5. Ẩn nút đóng và đặt lại trạng thái
    document.getElementById('popup-close-3d').style.display = 'none';
    isFocused = false;
}

// HÀM FOCUS ELEMENT (Đã cập nhật hiển thị số nhóm La Mã) 
function focusElement(targetObject, item){
    if (isFocused) return; 

    isFocused = true;
    targetObject.userData.focused = true;
    
    // VỊ TRÍ MỤC TIÊU MỚI: Dịch xuống (-100) và ra xa hơn (500)
    const newTargetPosition = new THREE.Vector3(0, -100, 500); 

    // 1. Dịch chuyển Camera tới vị trí TRUNG TÂM MÀN HÌNH MỚI
    new TWEEN.Tween(camera.position)
        .to({
            x: newTargetPosition.x,
            y: newTargetPosition.y,
            z: newTargetPosition.z + 500 // Giữ một khoảng cách nhìn cố định so với nguyên tố
        }, 1500) 
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    
    // 2. Ẩn tất cả các đối tượng khác và dịch chuyển đối tượng đích
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (object !== targetObject) {
            // ẨN: Thu nhỏ và làm trong suốt các ô khác
            object.userData.hidden = true;
            new TWEEN.Tween(object.scale)
                .to({x: 0.1, y: 0.1, z: 0.1}, 800)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            new TWEEN.Tween(object.element.style)
                .to({ opacity: 0 }, 500)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        } else {
            // DI CHUYỂN VÀ PHÓNG TO: Đưa ô đích về trung tâm mới
            
            // Di chuyển
            new TWEEN.Tween(object.position)
                .to(newTargetPosition, 1500)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
            
            // Phóng to kích thước HTML
            new TWEEN.Tween(object.element.style)
                .to({ width: '400px', height: '400px', opacity: 1 }, 1000) 
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
        }
    }
    
    // 3. TẠO CÁC NHÃN THÔNG SỐ (3D Labels)
    const atomicNumber = elements.indexOf(item) + 1; 
    const groupName = groupLegends[item.group] || 'Nhóm khác';
    
    // Thông tin Chu kỳ và Nhóm
    const period = item.y; 
    const group = item.x;  
    // 💡 SỬ DỤNG SỐ NHÓM LA MÃ
    const romanGroup = getRomanGroup(group);
    
    // Dữ liệu chi tiết cho nhãn 3D (ĐÃ ĐIỀU CHỈNH VỊ TRÍ CUỐI CÙNG)
    const details = [
        { text: `Số nguyên tử: ${atomicNumber}`, x: -350, y: 0, z: 0, color: 'yellow' },
        { text: `Khối lượng: ${item.mass}`, x: 350, y: 0, z: 0, color: '#7fff00' },
        // 💡 THAY ĐỔI: Thêm số La Mã
        { text: `Chu kỳ: ${period} | Nhóm: ${romanGroup} (${groupName})`, x: 0, y: 250, z: 0, color: 'lightblue' }
    ];
    
    // Tính toán vị trí Z của nhãn
    const focusZ = newTargetPosition.z + 50; 
    
    for(const detail of details){
        const detailDiv = document.createElement('div');
        detailDiv.className = 'detail-label';
        detailDiv.innerHTML = `<span style="color:${detail.color}">${detail.text}</span>`;
        
        const detailObject = new THREE.CSS3DObject(detailDiv);
        detailObject.position.set(
            newTargetPosition.x + detail.x, // Vị trí X mới của nguyên tố + X nhãn
            newTargetPosition.y + detail.y, // Vị trí Y mới của nguyên tố + Y nhãn
            focusZ 
        );
        
        // 💡 ĐÃ SỬA: BỎ LỆNH lookAt(camera.position) để nhãn không bị xoay ngược khi camera xoay
        // detailObject.lookAt(camera.position); // <--- Lệnh bị loại bỏ

        scene.add(detailObject);
        detailObjects.push(detailObject);
        
        // Hiệu ứng hiện dần nhãn
        new TWEEN.Tween(detailObject.element.style)
            .to({ opacity: 1 }, 1500)
            .delay(1000) 
            .start();
    }
    
    // 4. Hiển thị nút Đóng/Quay lại
    document.getElementById('popup-close-3d').style.display = 'block';
}


// Chuyển đổi mảng dữ liệu phẳng thành mảng đối tượng có cấu trúc
const elements=[];
for(let i=0;i<table.length;i+=6){ 
    const object={
        symbol:table[i],
        name:table[i+1],
        mass:table[i+2],
        x:table[i+3], // Vị trí X trong bảng = Nhóm (Group)
        y:table[i+4], // Vị trí Y trong bảng = Chu kỳ (Period)
        group:table[i+5] // Trường Mã Nhóm (Group Code)
    };
    elements.push(object);
}

// CẬP NHẬT: Đã xóa "Lantan và Actin" (9) khỏi Legend 
const groupLegends={
    1:"Kim loại",
    3:"Kim loại Chuyển tiếp",
    6:"Phi kim",
    8:"Khí hiếm ",
};


init();
animate();

// --- HÀM TẠO HÌNH DẠNG MỚI (Tam Giác) ---
function getTrianglePositions(count){
    const positions=[];
    const D=350;
    const X_OFFSET=0; 
    const Y_OFFSET=1800; 
    
    let currentRow=1;
    let elementsPlaced=0;
    
    while(elementsPlaced<count){
        const rowWidth=(currentRow-1)*D; 
        const startX=X_OFFSET-rowWidth/2;
        const currentY=Y_OFFSET-currentRow*D;

        for(let i=0;i<currentRow;i++){
            if(elementsPlaced>=count)break;

            positions.push({
                x:startX+i*D, 
                y:currentY, 
                z:0 
            });
            elementsPlaced++;
        }
        currentRow++;
    }
    return positions;
}


function init(){
    // 1. Cài đặt Scene & Camera
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0x050518);
    
    camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,10000);
    camera.position.z=2800; 
    camera.position.y=0;    

    // 2. Cài đặt Renderer
    renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 3. Cài đặt CSS3D Renderer
    cssRenderer=new THREE.CSS3DRenderer(); 
    cssRenderer.setSize(window.innerWidth,window.innerHeight);
    cssRenderer.domElement.style.position='absolute';
    cssRenderer.domElement.style.top='0px';
    document.getElementById('css-container').appendChild(cssRenderer.domElement);
    
    // 4. TẠO CÁC KHỐI NGUYÊN TỐ (CSS3DObject)
    for(let i=0;i<elements.length;i++){
        const item=elements[i];

        // Tạo thẻ div HTML
        const elementDiv=document.createElement('div');
        elementDiv.className='element';
        
        // ÁP DỤNG MÀU NỀN THEO NHÓM
        elementDiv.style.backgroundColor=getGroupColor(item.group); 
        
        // Gán object 3D và sự kiện dblclick
        const object=new THREE.CSS3DObject(elementDiv);
        // Lưu dữ liệu vào userData để dễ dàng thao tác sau này
        object.userData = { initialPosition: null, initialScale: null, focused: false, hidden: false };
        
        elementDiv.addEventListener('dblclick', () => {
            focusElement(object, item); 
        });
        
        // Thêm nội dung
        const number=document.createElement('div');
        number.className='number';
        number.textContent=(i+1);
        elementDiv.appendChild(number);

        const symbol=document.createElement('div');
        symbol.className='symbol';
        symbol.textContent=item.symbol;
        elementDiv.appendChild(symbol);

        const details=document.createElement('div');
        details.className='details';
        details.innerHTML=item.name+'<br>'+item.mass;
        elementDiv.appendChild(details);

        
        // Đặt ngẫu nhiên ban đầu 
        object.position.x=Math.random()*4000-2000;
        object.position.y=Math.random()*4000-2000;
        object.position.z=Math.random()*4000-2000;
        scene.add(object);
        objects.push(object);
    }
    
    // 5. TẠO BẢNG CHÚ THÍCH (Legend)
    const legendContainer=document.getElementById('legend');
    
    // Lặp qua các mã nhóm đã được định nghĩa trong groupLegends
    for(const groupCode in groupLegends){
        const code = parseInt(groupCode);
        
        if (!groupLegends[groupCode]) continue;

        const groupName=groupLegends[groupCode];
        const color=getGroupColor(code); 
        
        const itemDiv=document.createElement('div');
        itemDiv.className='legend-item';
        
        const colorBox=document.createElement('div');
        colorBox.className='color-box';
        colorBox.style.backgroundColor=color;
        
        itemDiv.appendChild(colorBox);
        itemDiv.appendChild(document.createTextNode(groupName));
        legendContainer.appendChild(itemDiv);
    }

    // 6. TẠO VỊ TRÍ MỤC TIÊU CHO CÁC BỐ CỤC 
    
    // Bố cục TABLE
    for(let i=0;i<elements.length;i++){
        const item=elements[i];
        const object=new THREE.Object3D();

        object.position.x=(item.x*320)-3040; 
        object.position.y=-(item.y*360)+1800; 
        
        targets.table.push(object);
    }
    
    // Bố cục SPHERE
    const vector=new THREE.Vector3();
    for(let i=0,l=objects.length;i<l;i++){
        const phi=Math.acos(-1+(2*i)/l);
        const theta=Math.sqrt(l*Math.PI)*phi;
        const object=new THREE.Object3D();
        object.position.setFromSphericalCoords(1500,phi,theta); 

        vector.copy(object.position).multiplyScalar(2);
        object.lookAt(vector);
        targets.sphere.push(object);
    }

    // Bố cục HELIX (Tam Giác)
    const TRIANGLE_COUNT=objects.length; 
    const triangle_positions=getTrianglePositions(TRIANGLE_COUNT);
    
    for(let i=0,l=objects.length;i<l;i++){
        const object=new THREE.Object3D();
        const pos=triangle_positions[i];
        object.position.set(pos.x,pos.y,pos.z);
        targets.helix.push(object);
    }

    // Bố cục GRID
    const gridSpacing=500; 
    const columns=10;
    const rows=8;
    const totalElementsPerLayer=columns*rows; 

    for(let i=0;i<objects.length;i++){
        const object=new THREE.Object3D();

        const xIndex=i%columns;
        const yIndex=Math.floor(i/columns)%rows;
        const zIndex=Math.floor(i/totalElementsPerLayer);

        object.position.x=(xIndex*gridSpacing)-((columns-1)*gridSpacing/2); 
        object.position.y=-(yIndex*gridSpacing)+((rows-1)*gridSpacing/2); 
        object.position.z=(zIndex*gridSpacing*2)-(3*gridSpacing);

        targets.grid.push(object);
    }


    // 7. Cài đặt Điều khiển
    controls=new THREE.OrbitControls(camera,cssRenderer.domElement);
    controls.minDistance=500;
    controls.maxDistance=10000; 
    
    // Bắt đầu với bố cục TABLE (Hình Chữ Nhật)
    transform(targets.table,2000); 

    // 8. Xử lý Sự kiện Nút - Thoát khỏi Focus trước khi chuyển đổi
    document.getElementById('table').addEventListener('click',function(){unfocusElements(); transform(targets.table,2000);});
    document.getElementById('sphere').addEventListener('click',function(){unfocusElements(); transform(targets.sphere,2000);});
    document.getElementById('helix').addEventListener('click',function(){unfocusElements(); transform(targets.helix,2000);}); 
    document.getElementById('grid').addEventListener('click',function(){unfocusElements(); transform(targets.grid,2000);}); 

    // 9. Xử lý thay đổi kích thước cửa sổ VÀ ĐÓNG FOCUS 3D
    window.addEventListener('resize',onWindowResize);
    // XỬ LÝ NÚT QUAY LẠI BẢNG TUẦN HOÀN
    document.getElementById('popup-close-3d').addEventListener('click', function(){
        unfocusElements();
    });
    
    // 💡 XỬ LÝ CHỨC NĂNG TÌM KIẾM MỚI (INPUT & BLUR)
    const searchInput = document.getElementById('element-search');
    searchInput.addEventListener('input', handleSearch);
    // 💡 SỰ KIỆN BLUR: Khi nhấp ra khỏi ô tìm kiếm
    searchInput.addEventListener('blur', function() {
        if (searchInput.value.trim() === '') {
            handleSearch(); // Gọi hàm tìm kiếm với input rỗng để reset
        }
    });
}

// 💡 HÀM XỬ LÝ TÌM KIẾM VÀ LÀM NỔI BẬT NGUYÊN TỐ (CẬP NHẬT)
function handleSearch() {
    // Lấy giá trị tìm kiếm, chuyển thành chữ thường và cắt khoảng trắng
    const searchTerm = document.getElementById('element-search').value.toLowerCase().trim();
    
    // Cố gắng chuyển đổi đầu vào thành số nguyên (cho tìm kiếm theo Số hiệu)
    const searchNumber = parseInt(searchTerm); 
    
    const isSearching = searchTerm.length > 0;
    
    // 1. Vòng lặp kiểm tra và xử lý tất cả các nguyên tố
    for (let i = 0; i < elements.length; i++) {
        const object = objects[i];
        
        const atomicNumber = i + 1; // Số hiệu nguyên tử (Index + 1)
        
        // Kiểm tra khớp: Số hiệu (chính xác)
        const numberMatch = !isNaN(searchNumber) && searchNumber === atomicNumber; 
        
        // Kiểm tra khớp: Ký hiệu (BAO GỒM chuỗi tìm kiếm)
        const symbolMatch = elements[i].symbol.toLowerCase().includes(searchTerm); 
        
        const isMatch = numberMatch || symbolMatch;
        
        if (isMatch && isSearching) {
            
            // Đặt lại kích thước và độ trong suốt của ô HTML về trạng thái mặc định trước khi phóng to
            object.element.style.opacity = '1';
            object.element.style.width = '280px';
            object.element.style.height = '280px';
            
            // Hiệu ứng NỔI BẬT:
            // 1. Outline và Shadow màu xanh lá cây
            object.element.style.outline = '5px solid #7fff00'; 
            object.element.style.boxShadow = '0px 0px 20px #7fff00'; 
            
            // 2. Phóng to đối tượng (Tăng Scale)
            new TWEEN.Tween(object.scale)
                .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
                
            // 3. Đẩy nguyên tố nổi bật ra phía trước (+50 trên trục Z)
            new TWEEN.Tween(object.position)
                .to({ z: targets.table[i].position.z + 50 }, 500)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
                
        } else {
            // Không khớp HOẶC không tìm kiếm (Input rỗng/Blur)
            
            // 1. Xử lý làm mờ (Nếu đang tìm kiếm) HOẶC reset opacity (Nếu không tìm kiếm)
            const targetOpacity = isSearching ? 0.2 : 1;
            
            new TWEEN.Tween(object.element.style)
                .to({ opacity: targetOpacity }, 500)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            
            // 2. Reset (Bỏ highlight và phóng to)
            object.element.style.outline = 'none'; 
            object.element.style.boxShadow = '0px 0px 12px rgba(0,255,255,0.5)'; 
            new TWEEN.Tween(object.scale)
                .to({ x: 1, y: 1, z: 1 }, 500)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            
            // 3. Đưa về vị trí Z ban đầu
            if(object.position.z !== targets.table[i].position.z){
                new TWEEN.Tween(object.position)
                    .to({ z: targets.table[i].position.z }, 500)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .start();
            }
        }
    }
}


function transform(targets,duration){
    TWEEN.removeAll();

    for(let i=0;i<objects.length;i++){
        const object=objects[i];
        const target=targets[i];

        new TWEEN.Tween(object.position)
            .to({x:target.position.x,y:target.position.y,z:target.position.z},Math.random()*duration+duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({x:target.rotation.x,y:target.rotation.y,z:target.rotation.z},Math.random()*duration+duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    new TWEEN.Tween(this)
        .to({},duration*2)
        .onUpdate(render)
        .start();
}

function onWindowResize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    cssRenderer.setSize(window.innerWidth,window.innerHeight);
    render();
}

function animate(){
    requestAnimationFrame(animate);
    TWEEN.update(); 
    controls.update(); 
    render();
}

function render(){
    cssRenderer.render(scene,camera);
}