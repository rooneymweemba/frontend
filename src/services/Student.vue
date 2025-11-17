<template>
<div class = "submission-form">
    <form @submit="submit">
    <label> name </label>
    <input type="text" required v-model="name">
   
    <br>

    <label> content </label>
    <textarea  rows="4" cols="50" required v-model="content"></textarea>
    <button id="submit">Submit</button>
    </form>
    
    
</div>
<div class="table-responsive">
    <h1 class="text-center">Student Component</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                
                <th>Student ID</th>
                <th>Name</th>
                <th>Content</th>
                <th>Status</th>
                <th>Date-Created</th>
                <th>Date-Updated </th>
                
                
            </tr>
        </thead>
        <tbody>
            <tr v-for = "student in sortedStudents" v-bind:key = "student.id">
            
            <td>{{student.id}}</td>
            <td>{{student.name}}</td>
            <td>{{student.content}}</td>
            <td>{{student.status}}</td>
            <td>{{student.created_at}}</td>
            <td>{{student.updated_at}}</td>
            
            </tr>
            
        </tbody>
    </table>
</div>
    
</template>

<script>
import StudentService from '../services/StudentService.js';
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
                    this.getStudents(); // Refresh the list after adding
                    this.name = '';
                    this.content = '';
                }).catch((e) => {
                    console.error('Error adding student:', e);
                })


            }
        },
    mounted() {
        this.getStudents();
 
    }
}
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
    text-color: #333;
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
</style>
