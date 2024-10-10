
let session = null;
window.onload = async()=>{
    session = await getSession();
    if (!session) 
        return window.location = '/login.html';

    profileInfo(session.user);
    fetchFiles(session.token);
}

const getMb = (byte)=>{
    const kb = byte/1000
    const mb = kb/1000
    return mb.toFixed(1)
}

const uploadFile = async (e)=>{
    try {
        const progress = document.getElementById('progress');
        const size = document.getElementById('size');
        const input = e.target
        const file = input.files[0]
        const fromData = new FormData()
        fromData.append('file',file)

        const options = {
            headers:{
                Authorization: `Bearer ${session.token}`
            },
            onUploadProgress: (e)=>{
                const total = e.total
                const loaded = e.loaded
                const percentage = Math.floor((loaded*100)/total)
                progress.style.width = percentage+'%'
                progress.innerHTML = percentage+'%'
                size.innerHTML = `${getMb(loaded)}Mb/${getMb(total)}Mb`
            }
        }
        await axios.post('/api/file', fromData, options)
        window.location = location.href
    } 
    catch (err) {
        console.log(err.message)
    }
}

const fetchFiles = async (session)=>{
   try {
    let count = 1
    const options = {
        headers:{
            Authorization: `Bearer ${session}`
        }
    }
    const res = await axios.get('/api/file', options)
    const table = document.getElementById('files-table')
    // table.innerHTML = ''
    for (const file of res.data) {
    const ui = `
                        <tr class="bg-gray-50 border-b ">
                        <td class="py-4 pl-3">${count}</td>
                        <td>${file.filename}</td>
                        <td>${file.size}</td>
                        <td>${file.type}</td>
                        <td>${moment(file.createdAt).format('DD MMM YYYY, hh:mm:ss A')}</td>
                        <td>
                            <div class="space-x-2">
                                <button class="bg-rose-500 text-white rounded w-8 h-8" onclick="deleteFiles('${file._id}')">
                                    <i class="ri-delete-bin-6-line"></i>
                                </button>

                                <button class="bg-violet-500 text-white rounded w-8 h-8" onclick="downloadFile('${file.path}', '${file.filename}')">
                                    <i class="ri-download-line"></i>
                                </button>

                                <button class="bg-green-500 text-white rounded w-8 h-8" onclick="openDrawer('${file.path}', '${file.filename}')">
                                    <i class="ri-share-line"></i>
                                </button>
                                
                            </div>
                        </td>
                    </tr>
    `
    table.innerHTML += ui
    count++
    }
   } 
   catch (err) {
    console.log(err.message)
   }
}

fetchFiles();

const deleteFiles = async(id)=>{
   try {

    const options = {
        headers:{
            Authorization: `Bearer ${session.token}`
        }
    }

    await axios.delete(`/api/file/${id}`, options)
    window.location = location.href
   } 
   catch (err) {
    console.log(err.response.data)
   }
}

const downloadFile = async(path, filename)=>{
   try {

    const options = {
        responseType: 'blob'
    }
    const { data } = await axios.post('/api/file/download', {path}, options)
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
   } 
   catch (err) {
    const error = await (err.response.data).text();
    console.log(error)
   }
}

const openDrawer = (path, filename)=>{

     //setting the file name to the label
     const fileName = document.getElementById("fileName");
     fileName.innerHTML = "Share File - "+filename

    //setting path in file input
    const fileInput = document.getElementById("file-input");
    fileInput.value = path;

    //setting sender emailID in file input
    const sender = document.getElementById("sender");
    sender.value = session.user.email;

   

    const drawer = document.getElementById('drawer');
    drawer.classList.remove("-right-[450px]");
    drawer.classList.add("right-0")
}

const closeDrawer = ()=>{
    const drawer = document.getElementById('drawer');
    drawer.classList.remove("right-0");
    drawer.classList.add("-right-[450px]")
}

const shareFile = async(e)=>{
    try {
        e.preventDefault();
        const loadingBtn = document.getElementById("loading-btn");
        loadingBtn.classList.remove('hidden')

        const sendingBtn = document.getElementById("sending-btn");  
        sendingBtn.classList.add('hidden')

        const options = {
            headers: {
                Authorization: `Bearer ${session.token}` 
            }
        }
        const form = e.target;
        const data = {
            sender: form[0].value,
            user: form[1].value,
            email: form[2].value,
            file: form[3].value,
        }
        await axios.post('/api/file/share', data, options)
        new Swal({
            icon: 'success',
            title:  'File Sent !'
        })
        form.reset()
        closeDrawer()
        loadingBtn.classList.add('hidden')
        sendingBtn.classList.remove('hidden')
    } 
    catch (err) {
        new Swal({
            icon: 'error',
            title:  'File Sending Failed !'
        })
    }
}