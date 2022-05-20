$(document).ready(() => {
    $('.btn-edit').click((e) => {
        let id = e.target.id
        for (let c of order) {
            if (c._id == id) {
                $('#txtName').val(c.Name)
                $('#txtStatus').val(c.Status)
                $('#txtId').val(c._id)
                $('#txtPhone').val(c.Phone)
                $('#txtAdd').val(c.Add)
                $('#txtNote').val(c.Note)
                $('#txtPrice').val(c.TotalPrice)

                $('#cartTable').empty()
                $('#cartTable').append(`
                    <tr>
                        <th>Tên</th>
                        <th>Kích cỡ</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                    </tr>
                `)

                for(i of c.Cart){
                    $('#cartTable').append(`
                    <tr>
                        <td>`+i.Name+`</td>
                        <td>`+i.Size+`</td>
                        <td>`+i.Qty+`</td>
                        <td>`+i.Price+`</td>
                    </tr>
                `)
                }
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
        let Note = $('#txtNote').val()

        if (Name.length < 10 || Phone.length != 10 || Add.length < 10 ){
            alert('Vui lòng kiểm tra lại thông tin !')
        } else {
            axios.post('/admin/suadonhang', {
                id: Id,
                Name: Name,
                Add: Add,
                Phone: Phone,
                Note: Note,
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

        axios.post('/admin/xoadonhang', {
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