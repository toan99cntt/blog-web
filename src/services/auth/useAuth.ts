import {apiRequest} from 'src/services/apiRequest';
import { User } from 'src/models/user';
import { ref, onMounted } from 'vue';
export const useAuth = () => {
  const user = ref({} as User);

  async function getInfoUser() {
    
  }

  onMounted(async() => {
    await getInfoUser();
  })

  return {
    user
  }
}
