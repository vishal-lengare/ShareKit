
let session = null;
window.onload = async()=>{
    session = await getSession();
    if (!session) 
        return window.location = '/login.html';

    profileInfo(session.user);
    fetchFiles(session.token);
}

const uploadFile = async (e)=>{
    try {
        const input = e.target
        const file = input.files[0]
        const fromData = new FormData()
        fromData.append('file',file)

        const options = {
            headers:{
                Authorization: `Bearer ${session.token}`
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

                                <button class="bg-green-500 text-white rounded w-8 h-8">
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