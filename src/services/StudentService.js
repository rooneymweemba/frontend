import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/student';
class StudentService {
    getStudents() {
        return axios.get(API_URL);
    }
    addStudent(student){
        return axios.post(API_URL, student);
    }

}
export default new StudentService();
