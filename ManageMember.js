class Member {
    constructor(id, avatar, name, mobile, email, status) {
        this.id = id;
        this.avatar = avatar;
        this.name = name;
        this.mobile = mobile;
        this.email = email;
        this.status = status;
    }
}
const manage_key = "data-member";
var members = [];
var page_size = 5;
var total_pages = 0;
var page_number = 1;
function init() {
    if (localStorage.getItem(manage_key) == null) {
        members = [
            new Member(1, "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/3.jpg", "jenny", '0387753200', 'jenny2031213@gmail.com', 'Active'),
            new Member(2, "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/30.jpg", "jerry", '0387753200', 'jerry2031213@gmail.com', 'Inactive'),
            new Member(3, "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/301.jpg", "rio", '0387753200', 'rio2031213@gmail.com', 'Active')
        ];
        localStorage.setItem(manage_key, JSON.stringify(members));
    }
    else {
        members = JSON.parse(localStorage.getItem(manage_key));
    }
}

function renderMember() {
    let data = members.slice((page_size * (page_number - 1)), (page_size * page_number));
    let htmls = data.map(function (member) {
        return `
            <tr>
                <td class="text-center">
                    <img class ="avatar-sm" src="${member.avatar}" alt="">
                </td>
                <td class="text-center">${member.name}</td>
                <td class="text-center">${member.mobile}</td>
                <td class="text-center">${member.email}</td>
                <td class="text-center">${member.status}</td>
                <td class="text-center">
                    <i class="fa-regular fa-pen-to-square" onclick = "getMember(${member.id})"></i>
                    <i class="fa-solid fa-trash" onclick = "removeMember(${member.id})"></i>
                </td>
            </tr>
        `
    });
    document.getElementById('tbManage').innerHTML = htmls.join("");
    buildPagination();
}
function openBuild() {
    document.querySelector('.build-container').classList.add('show');
}
function closeBuild() {
    document.querySelector('.build-container').classList.remove('show');
    reset();
}
function changeAvatar() {
    document.querySelector('.avatar-lg').src = document.querySelector('#avatar').value || 'images/no-avatar.jpg';
}
function add() {

    let avatar = document.querySelector('#avatar').value;
    if (!validation(avatar)) {
        alert(" Please add photos!")
        return;
    }
    let name = document.querySelector('#name').value;
    if (!validation(name)) {
        alert(" Please enter information!")
        return;
    }
    let mobile = document.querySelector('#mobile').value;
    if (!validation(mobile)) {
        alert(" Please enter information!")
        return;
    }
    let email = document.querySelector('#email').value;
    if (!validation(email)) {
        alert(" Please enter information!")
        return;
    }
    let status = document.querySelector('#status').value;
    if (!validation(status)) {
        alert(" Please enter information!")
        return;
    }
    let id = findMaxId() + 1;

    let member = new Member(id, avatar, name, mobile, email, status);
    members.push(member);
    localStorage.setItem(manage_key, JSON.stringify(members));
    closeBuild();
    renderMember();
}
function reset() {
    document.querySelector('#avatar').value = "";
    document.querySelector('#name').value = "";
    document.querySelector('#memberId').value = "0";
    document.querySelector('#mobile').value = "";
    document.querySelector('#email').value = "";
    document.querySelector('#status').value = "";
    document.querySelector('.avatar-lg').src = "images/no-avatar.jpg"

    document.querySelector('#btnUpdate').classList.add('d-none');
    document.querySelector('#btnAdd').classList.remove('d-none');
    document.querySelector('.build-title').innerText = "Add Member";
}
function validation(field) {
    return field != null && field.trim() != '';
}

function findMaxId() {
    let max = members[0];
    for (let i = 1 ; i < members.lenght ; ++i) {
        if (members[i].id > max) {
            max = members[i].id;
        }
    }
    return max;
}
function removeMember(memberId) {
    let confirm = window.confirm("Are you sure to remove this member?");
    if (confirm) {
        let index = members.findIndex(function (member) {
            return member.id == memberId;
        })
        members.splice(index, 1);
        localStorage.setItem(manage_key, JSON.stringify(members));
        renderMember();
    }
}
function getMember(memberId) {
    let index = members.find(function (member) {
        return member.id == memberId;
    })
    document.querySelector('#avatar').value = index.avatar;
    document.querySelector('#name').value = index.name;
    document.querySelector('#memberId').value = index.id;
    document.querySelector('#mobile').value = index.mobile;
    document.querySelector('#email').value = index.email;
    document.querySelector('#status').value = index.status;
    document.querySelector('.avatar-lg').src = index.avatar;

    document.querySelector('#btnUpdate').classList.remove('d-none');
    document.querySelector('#btnAdd').classList.add('d-none');

    document.querySelector('.build-title').innerText = "Update Member";
    openBuild();
}

function update() {

    let id = document.querySelector('#memberId').value;

    let index = members.find(function (member) {
        return member.id == id;
    })
    index.avatar = document.querySelector('#avatar').value;
    index.name = document.querySelector('#name').value;
    index.mobile = document.querySelector('#mobile').value;
    index.email = document.querySelector('#email').value;
    index.status = document.querySelector('#status').value;
    localStorage.setItem(manage_key, JSON.stringify(members));
    closeBuild();
    renderMember();
}
function buildPagination() {
    total_pages = Math.ceil(members.length / page_size);
    let paginationString = "";
    let start = page_number == 1 ? 1 : page_number == total_pages ? page_number - 2 : page_number - 1;
    let end = page_number == total_pages ? total_pages : page_number == 1 ? page_number + 2 : page_number + 1;
    paginationString += `<button class="tbn-page " onclick='changePage(1)'>&#x25C0;</button>`;
    for (let page = 1; page <= total_pages; page++) {
        paginationString += `
                                    <button class='tbn-page ${page == page_number ? 'active' : ''}'
                                        onclick='changePage(${page})'>
                                ${page}</button>`
    }
    paginationString += `<button class="tbn-page " onclick='changePage(${total_pages})'>&#x25B6;</button>`;
    document.getElementById('paging-area').innerHTML = paginationString;
}
function changePage(page) {
    page_number = page;
    renderMember();
}

function master() {
    init();
    renderMember();
}
master();


