<template>
<button class=" float-left p-2 bg-blue-500  rounded m-2 text-white" @click="backToMainMenu">back</button>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4 text-center">Student Details</h2>
    
    <div v-if="student">
      <p><strong>Name:</strong> {{ student.name }}</p>
      <p><strong>Student ID:</strong> {{ student.student_id }}</p>
      <p><strong>Content:</strong> {{ student.content }}</p>
      <p><strong>Status:</strong> {{ student.status }}</p>
      <p><strong>Created:</strong> {{ student.createdAt }}</p>
      <p><strong>Updated:</strong> {{ student.updatedAt }}</p>
    </div>

    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StudentService from './StudentService';

const route = useRoute();
const router = useRouter();



const backToMainMenu = () => {
  //window.open(`/studentDetails/${student.student_id}`, "_blank");
   router.push("/")
};


const student = ref(null);
onMounted(async () => {
  try{
    const id = route.params.student_id;
    const response = await StudentService.getStudentById(id);
    student.value = response.data;
  }
  catch (e) {
    console.error("failed to load student details", e)
  }
});



</script>
