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
    deleteStudent(id){
        
        console.log(id);

        
        return axios.delete(`${API_URL}/${id}`);
    }
    updateStudent(id, name, status){
        const PUTUrl = API_URL + "/" + id + "?";
        if(!name  ^ status){
            return axios.put(`${PUTUrl}?status=${status}`);        
        }
        if(name  ^ !status){
            return axios.put(`${PUTUrl}?name=${name}`);

        }
        else{
            return axios.put(`${PUTUrl}?status=${status}`+`&`+`name=${name}`);
        }
    }

}
export default new StudentService();
