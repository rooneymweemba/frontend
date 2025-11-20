<template>
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

<div class="grid overflow-x-auto flex-nowrap p-2   lg:grid-cols-1 gap-4 max-w-lg mt-6 mx-auto"
>
    <div class="overflow-x-auto flex-nowrap bg-white p-4 rounded-lg shadow hover:shadow-lg transition" 
    v-for="student in sortedStudents" :key="student.id" @click="SelectedStudent(student.id)">
        <h3>name: {{ student.name }}</h3>
        <p>content: {{ student.content }}</p>
        <p>Status: {{ student.status }}</p>
        <p>Created At: {{ student.createdAt }}</p>
        <p>Updated At: {{ student.updatedAt }}</p>
        <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 m-2" >
            View Details
        </button>
        <button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-red-600 m-2" >edit</button>
        <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 m-2" >delete</button>
    </div>

</div>
<div class="flex justify-center mt-4">
<button class="bg-gray-200 p-2 m-2 hover:bg-gray-300" @click="getStudents(currentpage - 1)" :disabled="currentpage == 0" > prev </button>
<span class="m-2 p-2"> Page {{currentpage + 1}} of {{totalPages}}  </span>
<button class="bg-gray-200 p-2 m-2 hover:bg-gray-300" id=" next" @click="getStudents(currentpage + 1)" :disabled="currentpage > totalPages - 2"> next </button>
</div>
</template>

<script setup>
/*import StudentService from '../services/StudentService.js';
    export default {
    
        name: "StudentView",
        data() {
            return {
                name: '',
                content: '',
                students: []
            };
        },
        computed: {
            sortedStudents() {
                return [...this.students].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
        },
        methods: {
            getStudents() {
               StudentService.getStudents().then((response) =>{
                    this.students = response.data;
               }).catch((e) => {
                    console.error('Error fetching students:', e)
               });
            },
            submit(){
                const student = {
                    name: this.name,
                    content: this.content
                };
                StudentService.addStudent(student).then(() => {
                    this.getStudents(); 
                    this.name = '';
                    this.content = '';
                }).catch((e) => {
                    console.error('Error adding student:', e);
                })


            }
        },
    mounted() {
        this.getStudents();
 
    }*/
    import {ref, computed, onMounted} from 'vue';
    import StudentService from './StudentService.js';
    const name = ref('');
    const content = ref('');
    const students = ref([]);
    let currentpage = ref(0);
    let totalPages = ref(3);
    let studentID = ref(0);
    

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
    const SelectedStudent = (id)=> {
        studentID = id;
    }
    const deleteStudent = (studentID)=>{
        if(studentID = 0){
            StudentService.deleteStudent(id)
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
    onMounted(() => {
        getStudents(0, 7);
    });
</script>
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
