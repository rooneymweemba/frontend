<template>
<div class="container">
    <h1 class="text-center">Student Component</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Content</th>
                <th>Status</th>
                <th>Date-Updated </th>
                <th>Date-Created</th>
                
            </tr>
        </thead>
        <tbody>
            <tr v-for = "student in students" v-bind:key = "student.id">
            <td>{{student.id}}</td>
            <td>{{student.name}}</td>
            <td>{{student.content}}</td>
            <td>{{student.status}}</td>
            <td>{{student.updated_at}}</td>
            <td>{{student.created_at}}</td>
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
                students: []
            };
        },
        methods: {
            getStudents() {
               StudentService.getStudents().then((response) =>{
                    this.students = response.data;
               }).catch((e) => {
                    console.error('Error fetching students:', e)
               });
            }
        },
        mounted() {
    this.getStudents();
  }
    }
</script>
