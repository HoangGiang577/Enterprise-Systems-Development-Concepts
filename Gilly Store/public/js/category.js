$(document).ready(() => {
    $('#btnAdd').click((e) => {
        e.preventDefault()

        let Name = $('#txtName').val()
        let Status = $('#txtStatus').val()
        let Slug = $('#txtSlug').val()

        if (Name.length < 5 || Slug.length < 5) {
            alert('Vui lòng kiểm tra lại thông tin !')
        } else {
            axios.post('/admin/themdanhmuc', {
                Name: Name,
                Status: Status,
                Slug:Slug
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

    $('.btn-edit').click((e) => {
        let id = e.target.id
        for (let c of cate) {
            if (c._id == id) {
                $('#txtName').val(c.Name)
                $('#txtStatus').val(c.Status)
                $('#txtId').val(c._id)
                $('#txtSlug').val(c.Slug)
            }
        }
    })

    $('#btnEdit').click((e) => {
        e.preventDefault()

        let Name = $('#txtName').val()
        let Status = $('#txtStatus').val()
        let Id = $('#txtId').val()
        let Slug = $('#txtSlug').val()

        if (Name.length < 5 || Slug.length< 5) {

            alert('Vui lòng kiểm tra lại thông tin !')
        } else {
            axios.post('/admin/suadanhmuc', {
                id: Id,
                Name: Name,
                Status: Status,
                Slug: Slug,
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

        axios.post('/admin/xoadanhmuc', {
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