import { Container } from "@mui/material"
import CreateItem from "./CreateItem"
import Tasklist from "./TaskList"


const Home = () => {

    return (
        <Container style={{ background: '#595959', minHeight: '90vh', borderRadius: '0.2rem' }}>
            <CreateItem />
            <Tasklist />
        </Container>
    )
}

export default Home;
