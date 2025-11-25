import { createRouter } from "vue-router"
import StudentDetailsView from '..services/StudentDetailsView.vue'


const routes = {
  path: "/student/:id",
  name: "StudentDetails",
  component: () => import("../views/StudentDetailsView.vue"),
  props: true
}
const router = createRouter({
    routes
})
export default router