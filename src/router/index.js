import { createRouter, createWebHistory } from "vue-router"
import StudentDetailsView from "../services/StudentDetailsView.vue"
import StudentView from "../services/StudentView.vue"

const routes = [
{
  path: "/studentDetails/:student_id",
  name: "StudentDetailsView",
  component: StudentDetailsView,

},
{
  path: "/",
  name: "StudentsView",
  component: StudentView,
},

];

const router = createRouter({
  history: createWebHistory(),  
  routes,
});
export default router;