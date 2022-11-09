async function editFormHandler(event){
    event.preventDefault();

    const title = document.querySelector('input[name="blog-title"]').value;
    const content = document.querySelector('textarea[name="blog-content"]').value;
    const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok){
        document.location.replace('/dashboard-routes/');
    }else {
        alert(response.statusText);
    }

}

document.querySelector('.edit-blog-form').addEventListener('submit', editFormHandler)