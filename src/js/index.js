import Vue from "vue";

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { quillEditor } from 'vue-quill-editor';

const vm = new Vue({
    el: '#maincontainer',
    data: {
        editorOption: {
            theme: 'snow',
            modules: {
                toolbar: {
                    container:  [
                        ['bold', 'italic', 'underline', 'strike'], ['clean'],
                        ['blockquote'],
                        [{'header': 1}, {'header': 2}],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        [{'script': 'sub'}, {'script': 'super'}],

                        [{'direction': 'rtl'}],
                        [{'size': ['small', false, 'large', 'huge']}],
                        [{'header': [1, 2, 3, 4, 5, 6, false]}],
                        [{'color': []}, {'background': []}],
                        [{'align': []}],
                        ['link', 'image']
                    ],
                    handlers: {
                        'image': imageHandler
                    }
                }
            },
            placeholder: ''
        },
        ceshi: null
    },
    components: {
        QuillEditor:quillEditor
    }
});
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
                    let formData= new FormData();
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
                    }
                    fileInput.value = "";
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        });
        this.container.appendChild(fileInput);
    }
    fileInput.click();
}