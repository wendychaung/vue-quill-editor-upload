# vue-quill-editor的图片上传
<h6>基于vue-quill-editor的图片上传的修改，将base64的上传改为upload</h6>


### 使用方法

```
function imageHandler() {
    let fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput == null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpg, image/jpeg, image/bmp, image/x-icon');
        fileInput.classList.add('ql-image');
        fileInput.addEventListener('change', () => {
            if (fileInput.files != null && fileInput.files[0] != null) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let range = this.quill.getSelection(true);
                    **let formData= new FormData();
                    formData.append("file",fileInput.files[0]);
                    let myimg;
                    $.ajax({
                        url:"http://ohhitp3nx.bkt.clouddn.com",
                        data:formData,
                        type:'POST',
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        async: false
                    }).done(function (data) {
                        // if (data.errorCode == 0) {
                        //     myimg = data.fileUrl;
                        // }
                        myimg=data
                    });
                    if(myimg!=""){
                        this.quill.insertEmbed(range.index, 'image', myimg);
                    }**
                    fileInput.value = "";
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        });
        this.container.appendChild(fileInput);
    }
    fileInput.click();
}
```

