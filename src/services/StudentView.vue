<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <!-- submission -->

  <div
    class="grid max-w-[700px] mx-auto bg-white shadow-xl rounded-xl p-6 mt-10 border-bottom-1 border-gray-200"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <label
        class="grid text-sm font-semibold text-gray-700 uppercase tracking-wide"
      >
        name
      </label>
      <input
        class="grid max-w-[500px] w-full mx-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        type="text"
        required
        v-model="name"
      />

      <br />

      <label
        class="grid text-sm font-semibold text-gray-700 uppercase tracking-wide"
      >
        content
      </label>

      <textarea
        class="grid max-w-[500px] w-full mx-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        required
        v-model="content"
      ></textarea>
      <br />
      <button
        class="w-[100px] mx-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all font-medium"
        id="submit"
      >
        Submit
      </button>
      <div v-if="errors.length" class="text-red-500 text-sm">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
    </form>
  </div>

  <!-- students view -->
  <div
    class="grid overflow-x-auto flex-nowrap p-2 lg:grid-cols-1 gap-4 max-w-lg mt-6 mx-auto"
  >
    <div
      class="overflow-x-auto flex-nowrap bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
      v-for="student in sortedStudents"
      :key="student.id"
      @click="selectedStudent(student.student_id)"
    >
      <p>name: {{ student.name }}</p>
      <p>Status: {{ student.status }}</p>
      <p>Created: {{ student.createdAt }}</p>
      <p>Last Updated: {{ student.updatedAt }}</p>
      <button
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 m-2"
        @click.stop="openDetailsInNewTab(student)"
      >
        View Details
      </button>

      <button
        class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-red-600 m-2"
        @click.stop="openEditPopup(student)"
      >
        edit
      </button>
      <button
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 m-2"
        @click.stop="showConfirmationPopup(student.id)"
      >
        delete
      </button>
    </div>
  </div>
  <!-- confirmation popup -->
  <div
    v-if="confirmationPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <p>are you sure you want to delete this student record</p>
      <button
        class="px-2 text-white bg-blue-500 rounded m-2"
        @click="closeConfirmationPopup"
      >
        cancel
      </button>
      <button
        class="px-2 text-white bg-red-500 rounded m-2"
        @click="confirmDelete"
      >
        delete
      </button>
    </div>
  </div>
  <!-- edit popup -->
  <div
    v-if="showEditPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center justify-items-left z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">Edit Student</h2>
      <form>
        <label class="block mb-1 al">Name</label>
        <input
          class="block w-[250px] mx-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          type="text"
          v-model="editStudentData.name"
        />

        <br />
        <label> Content </label>
        <textarea
          class="block w-[250px] mx-auto my-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          v-model="editStudentData.content"
        ></textarea>

        <label class="py-7 space-x-1" for="Status">status: </label>
        <select class="mb-7" id="status" v-model="editStudentData.status">
          <option value="DONE">DONE</option>
          <option value="PENDING">PENDING</option>
        </select>
        <br /><br />
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded m-2 hover:bg-blue-600"
          @click="showEditPopup = false"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-red-500 text-white rounded m-2 hover:bg-red-600"
          @click="saveEdit"
        >
          Save
        </button>
      </form>
    </div>
  </div>

  <!-- navigation -->
  <div class="flex justify-center mt-4">
    <button
      class="bg-gray-200 p-2 m-2 hover:bg-gray-300"
      @click="getStudents(currentpage - 1)"
      :disabled="currentpage == 0"
    >
      prev
    </button>
    <span class="m-2 p-2">
      Page {{ currentpage + 1 }} of {{ totalPages }}
    </span>
    <button
      class="bg-gray-200 p-2 m-2 hover:bg-gray-300"
      id=" next"
      @click="getStudents(currentpage + 1)"
      :disabled="currentpage > totalPages - 2"
    >
      next
    </button>
  </div>
</template>
<!-- scripts -->
<script setup>
import { ref, computed, onMounted } from "vue";
import StudentService from "./StudentService.js";
import { useRouter } from "vue-router";
const router = useRouter();

const name = ref("");
const content = ref("");
const students = ref([]);

let currentpage = ref(0);
let totalPages = ref(3);
let selectedStudentID = ref("");

const showEditPopup = ref(false);
const confirmationPopup = ref(false);
const targetId = ref(null);
const editStudentData = ref({ id: "", name: "", content: "" });

const errors = ref([]);

const sortedStudents = computed(() => {
  return [...students.value].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
});
const getStudents = (pages = 0, size = 7) => {
  StudentService.getPagedStudents(pages, size)
    .then((response) => {
      students.value = response.data.content;
      totalPages = response.data.totalPages;
      currentpage = response.data.number;
    })
    .catch((e) => {
      console.error("Error fetching students:", e);
    });
};
const selectedStudent = (student_id) => {
  console.log("stuudent selected {}", student_id);
  selectedStudentID.value = student_id;
};
//
const showConfirmationPopup = (student_id) => {
  console.log("button accessed");
  targetId.value = student_id;
  confirmationPopup.value = true;
};

const closeConfirmationPopup = () => {
  confirmationPopup.value = false;
  targetId.value = null;
};

const confirmDelete = () => {
  StudentService.deleteStudent(targetId.value)
    .then(() => {
      getStudents(currentpage, 7);
    })
    .catch((e) => {
      console.error("Error deleting student:", e);
    });

  targetId.value = null;
  confirmationPopup.value = false;
};

const submit = () => {
  errors.value = [];

  const numericRegex = /^[a-zA-Z ]*$/;
  if (!name.value) {
    errors.value.push("Name is required");
  } else if (!numericRegex.test(name.value)) {
    errors.value.push("Name must not contain a numerals");
  }
  if (!content.value) {
    errors.value.push("Content is required.");
  } else if (content.value.length > 255) {
    errors.value.push("Content must not exceed 255 characters. ");
  }

  if (errors.value.length) return;

  const studentObject = {
    name: name.value,
    content: content.value,
  };
  StudentService.addStudent(studentObject)
    .then(() => {
      getStudents();
      name.value = "";
      content.value = "";
    })
    .then(() => {
      getStudents(currentpage, 7);
    })
    .catch((e) => {
      console.error("Error adding student:", e);
    });
};

const openDetailsInNewTab = (student) => {
  //window.open(`/studentDetails/${student.student_id}`, "_blank");
   router.push(`/studentDetails/${student.student_id}`,)
};
const openEditPopup = (student) => {
  editStudentData.value = { ...student };

  showEditPopup.value = true;
};
const saveEdit = () => {
  const studentObject = {
    student_id: editStudentData.value.student_id,
    name: editStudentData.value.name,
    content: editStudentData.value.content,
    status: editStudentData.value.status,
  };
  console.log(studentObject.name);
  StudentService.updateStudent(studentObject)
    .then(() => {
      getStudents(currentpage, 7);
    })
    .catch((e) => {
      console.error("Error editing student:", e);
    });

  editStudentData.value = { id: "", name: "", content: "", status: "" };
  showEditPopup.value = false;
};

onMounted(() => {
  getStudents(0, 7);
  selectedStudent(0);
});
</script>
