<template>
<!-- submission -->
<div class = "submission-form">
    <form @submit.prevent="submit">
    <label> name </label>
    <input type="text" required v-model="name">
   
    <br>

    <label> content </label>
    <textarea  rows="4" cols="50" required v-model="content"></textarea>
    <button id="submit">Submit</button>
    </form>
    
    
</div>
<!-- students view -->
<div class="grid overflow-x-auto flex-nowrap p-2   lg:grid-cols-1 gap-4 max-w-lg mt-6 mx-auto"
>
    <div class="overflow-x-auto flex-nowrap bg-white p-4 rounded-lg shadow hover:shadow-lg transition" 
    v-for="student in sortedStudents" :key="student.id" @click="selectedStudent(student.id)">
        <h3>name: {{ student.name }}</h3>
        <p>content: {{ student.content }}</p>
        <p>Status: {{ student.status }}</p>
        <p>Created At: {{ student.createdAt }}</p>
        <p>Updated At: {{ student.updatedAt }}</p>
        <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 m-2" >
            View Details
        </button>
        <button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-red-600 m-2" @click.stop ="openEditPopup()" >edit </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 m-2" @click.stop="deleteStudent(student.id)" >delete</button>
        
    </div>

</div>
<!-- edit popup -->
<div
    v-if="showEditPopup" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Edit Student </h2>
        <form>
            <label class ="block mb-1">Name</label>
            <input type="text" v-model="editStudentData.name" class="border w-full p-2 mb-3 rounded"/>
            <label for="Status" >status: </label>
            <select id="status" name="fruits">
            <option value="DONE">DONE</option>
            <option value="PENDING">PENDING</option>
            </select>

        </form>
       
        <!-- <label class="block mb-1">Content</label>
        <textarea 
        v-model="editStudentData.content" rows="3" class="border w-full p-2 mb-3 rounded"
    > -->


    <div class="flex justify-end">
        <button 
            class="px-4 py-2 bg-gray-500 text-white rounded mr-2 hover:bg-gray-600"
            @click="showEditPopup = false">
            Cancel
        </button>
        <button 
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" @click="saveEdit"
        >
            Save
        </button>
    </div>
</div>


</div>
<div class="flex justify-center mt-4">
<button class="bg-gray-200 p-2 m-2 hover:bg-gray-300" @click="getStudents(currentpage - 1)" :disabled="currentpage == 0" > prev </button>
<span class="m-2 p-2"> Page {{currentpage + 1}} of {{totalPages}}  </span>
<button class="bg-gray-200 p-2 m-2 hover:bg-gray-300" id=" next" @click="getStudents(currentpage + 1)" :disabled="currentpage > totalPages - 2"> next </button>
</div>
</template>
<!-- scripts -->
<script setup>
    
    import {ref, computed, onMounted} from 'vue';
    import StudentService from './StudentService.js';

    
    const name = ref('');
    const content = ref('');
    const students = ref([]);
    let currentpage = ref(0);
    let totalPages = ref(3);
    let selectedID = ref('');
    const showEditPopup = ref(false)
    const editStudentData = ref({id: '', name: '', content: '' });
    

    const sortedStudents = computed(() => {
        return [...students.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });
    const getStudents = (pages = 0, size = 7) => {
        StudentService.getPagedStudents(pages, size).then((response) => {
            students.value = response.data.content;
            totalPages = response.data.totalPages;
            currentpage = response.data.number;
        }).catch((e) => {
            console.error('Error fetching students:', e);
        });
    };
    const selectedStudent = (id)=> {
        console.log('stuudent selected {}', id);
        selectedID.value = id;
    }

    const deleteStudent = (id)=>{
        console.log()
        if (confirm('are you sure you want to delete this student?')){
            console.log('deleting student with id =' + id)
            StudentService.deleteStudent(id).then(() => getStudents(currentpage.value, 7))

        }
    }; 
    const submit = () => {
        const studentObject = {
            name: name.value,
            content: content.value
        };
        StudentService.addStudent(studentObject).then(() => {
            getStudents();
            name.value = '';
            content.value = '';
        }).catch((e) => {
            console.error('Error adding student:', e);
        });
    };
    const openEditPopup = (student) => {
        editStudentData.value = {...student};
        showEditPopup.value = true;
    }
    // const saveEdit = () => {
    //     const studentObject = {
    //         status: status.value,
    //         content: content.value
    //     };
    //     StudentService.u
    // }
   
    onMounted(() => {
        getStudents(0, 7);
        selectedStudent(0);
        
    });
</script>
<!-- css --> 
<style>

form {
    max-width: 420px;
    margin: 30px auto;
    background: white;
    text-align:left;
    padding: 40px;
    border-radius: 10px;
}
label {
    color: #171313;
    font: helvetica;
    display: inline-block;
    margin-bottom: 20px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    
}
input {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box ;
    border: 2px solid #4a4a4a; 
    color: #555;
}
button#submit {
    background: #27ae60;
    color: white;
    border: none;
    padding: 10px 15px 10px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1em;
    display: block;
    margin: 20px auto 0 auto;
    font: helvetica;
  
    
}
table {
    margin: 50px auto;
    max-width: 800px;
}
textarea {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box ;
    border: 2px solid #4a4a4a;
    color: #555;
}

.popup {
    position: fixed;
    top: 0;
    left:0;
    right:0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0,0,0,0.2);
}
.popup-inner {
    background: #FFF;
    padding: 32px;


}


 /* .card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin: 30px auto;
  max-width: 1000px;
}

.card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  margin: 0 10px;
  padding: 6px 12px;
}  */
</style>
