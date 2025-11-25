<template>
  <div
    
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-left">
      <h2 class="text-xl font-bold mb-4 text-center">Student Details</h2>
      <p>name: {{ editStudentData.name }}</p>
      <p>student_id: {{ editStudentData.student_id }}</p>
      <p>content: {{ editStudentData.content }}</p>
      <p>Status: {{ editStudentData.status }}</p>
      <p>Created At: {{ editStudentData.createdAt }}</p>
      <p>Updated At: {{ editStudentData.updatedAt }}</p>

      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-gray-500 text-white rounded mr-2 hover:bg-gray-600"
          @click="showDetailPopup = false"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StudentService from '../StudentService';

const route = useRoute();
const student = ref({});


</script>

<style>

</style>