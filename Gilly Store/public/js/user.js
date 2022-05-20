$(document).ready(() => {
    $('.btn-edit').click((e) => {
        let id = e.target.id
        for (let c of alluser) {
            if (c._id == id) {
                $('#txtName').val(c.Name)
                $('#txtStatus').val(c.Status)
                $('#txtId').val(c._id)
                $('#txtPhone').val(c.Phone)
                $('#txtAdd').val(c.Address)
                $('#txtGroup').val(c.userGroup)
                $('#txtEmail').val(c.Email)
            }
        }
    })

    $('#btnEdit').click((e) => {
        e.preventDefault()

        let Name = $('#txtName').val()
        let Status = $('#txtStatus').val()
        let Id = $('#txtId').val()
        let Phone = $('#txtPhone').val()
        let Add = $('#txtAdd').val()
        let userGroup = $('#txtGroup').val()
        let Password = $('#txtPassword').val()

        if (Name.length < 10 || Phone.length != 10 || Add.length < 10 ){
            alert('Vui lòng kiểm tra lại thông tin !')
        } else {
            axios.post('/admin/suataikhoan', {
                id: Id,
                Name: Name,
                Address: Add,
                Phone: Phone,
                Password: Password,
                userGroup: userGroup,
                Status: Status
            })
                .then((response) => {
                    if (response.data.result === 0) {
                        alert('Đã có lỗi xảy ra vui lòng thử lại sau !')
                    } else {
                        alert('Thành công !')
                        location.reload()
                    }
                })
        }
    })

    $('#btnDel').click((e) => {
        e.preventDefault()

        let Id = $('#txtId').val()

        axios.post('/admin/xoataikhoan', {
            id: Id,
        })
            .then((response) => {
                if (response.data.result === 0) {
                    alert('Đã có lỗi xảy ra vui lòng thử lại sau !')
                } else {
                    alert('Thành công !')
                    location.reload()
                }
            })
    })

})