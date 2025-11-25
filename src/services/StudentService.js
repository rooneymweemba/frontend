import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/student';
class StudentService {
    getStudents() {
        return axios.get(API_URL);
    }
    getPagedStudents(page, size){
        return axios.get(`${API_URL}/paginationAndSort/${page}/${size}/createdAt`);
    }
    addStudent(student){
        return axios.post(API_URL, student);
    }
    deleteStudent(student_id){
        
        console.log(student_id);

        
        return axios.delete(`${API_URL}/${student_id}`);
    }
    updateStudent(student){
        return axios.put(`${API_URL}/updateStudent/${encodeURIComponent(student.student_id)}?name=${encodeURIComponent(student.name)}&status=${encodeURIComponent(student.status)}&content=${encodeURIComponent(student.content)}`)
    }

}
export default new StudentService();
