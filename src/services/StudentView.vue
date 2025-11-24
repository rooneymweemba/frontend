<template>
<!-- submission -->

<div class = "mx-auto bg-white shadow-xl rounded-xl p-6 mt-10 border border-gray-200">
    <form class=" w-200 space-y-4" @submit.prevent="submit ">
    <label  class=" block text-sm font-semibold text-gray-700 uppercase tracking-wide"> name </label>
    <input class = "w-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" type="text" required v-model="name" >
   
    <br>

    <label> content </label>
    <br>
    <textarea class="w-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"  rows="4" cols="50" required v-model="content"></textarea>
    <br>
    <button class="w-28 mx-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all font-medium" id="submit">Submit</button>
    </form>
    
    
</div>

<!-- students view -->
<div class="grid overflow-x-auto flex-nowrap p-2   lg:grid-cols-1 gap-4 max-w-lg mt-6 mx-auto"
>
    <div class="overflow-x-auto flex-nowrap bg-white p-4 rounded-lg shadow hover:shadow-lg transition" 
    v-for="student in sortedStudents" :key="student.id" @click="selectedStudent(student.id)">
        <p>name: {{ student.name }}</p>
        <p>Status: {{ student.status }}</p>
        <p>Created: {{ student.createdAt }}</p>
        <p>Last Updated: {{ student.updatedAt }}</p>
        <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 m-2" @click.stop="openDetailPopup(student)" >View Details</button>
        <button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-red-600 m-2" @click.stop ="openEditPopup(student)" >edit </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 m-2" @click.stop="deleteStudent(student.id)" >delete</button>
        


    </div>

</div>
<!-- edit popup -->
<div  v-if="showEditPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Edit Student </h2>
        <form>
            <label class ="block mb-1">Name</label>
            <input type="text" v-model="editStudentData.name" class="border w-full p-2 mb-3 rounded"/>
            <label for="Status" >status: </label>
            <select id="status" v-model="editStudentData.status">
            <option value="DONE">DONE</option>
            <option value="PENDING">PENDING</option>
            </select>
            <br>
            <label> content </label>
            <textarea  rows="4" cols="50"  v-model="editStudentData.content"></textarea>
            
        </form>
       
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
<!-- Detail popup -->
    <div  v-if="showDetailPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-left">
            <h2 class="text-xl font-bold mb-4 text-center">Student Details </h2>
            <p>name: {{ editStudentData.name }}</p>
            <p>id: {{ editStudentData.id }}</p>
            <p>content: {{ editStudentData.content }}</p>
            <p>Status: {{ editStudentData.status }}</p>
            <p>Created At: {{ editStudentData.createdAt }}</p>
            <p>Updated At: {{ editStudentData.updatedAt }}</p>
       
    <div class="flex justify-end">
        <button 
            class="px-4 py-2 bg-gray-500 text-white rounded mr-2 hover:bg-gray-600" @click="showDetailPopup = false"> Cancel  </button>
    </div>
</div>



</div>
<!-- navigation -->
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
    const showEditPopup = ref(false);
    const editStudentData = ref({id: '', name: '', content: '' });
    const originalStudentData = ref({id: '', name: '', content: '' }); 
    const showDetailPopup = ref(false);
    

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
        originalStudentData.value = {...student};
        showEditPopup.value = true;
    }

     const openDetailPopup = (student) => {
        editStudentData.value = {...student};
        console.log("student " + editStudentData.value)
        showDetailPopup.value = true;
    }
//     const getChangedFields = () => {
//         const changed = {};
//         for (const key in editStudentData.value) {
//     if (editStudentData.value[key] !== originalStudentData.value[key]) {
//       changed[key] = editStudentData.value[key];
//     }
//     return changed
//   }


    //}
    //const saveEdit = () => {
         
    //      StudentService.updateStudent(studentObject.)
    // }
   
    onMounted(() => {
        getStudents(0, 7);
        selectedStudent(0);
        
    });
</script>

