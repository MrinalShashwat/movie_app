 
import React, { useEffect, useState } from 'react';
import { 
    Layout, 
    Input, 
    Row, 
    Col, 
    Card, 
    Tag, 
    Spin, 
    Alert, 
    Modal, 
    Typography 
} from 'antd';
import 'antd/dist/antd.css';



const API_KEY = '2d6e3ae3';
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;





const SearchBox = ({searchHandler}) => {
    return (
        <Row>
            <Col  span={12} offset={6}>
                <Search
                    placeholder="enter movie, series, episode name"
                    enterButton="Search"
                    size="large"
                    allowClear = "True"
                    onSearch={value => searchHandler(value)}
                />
            </Col>
        </Row>
    )
}

const ColCardBox = ({Title, imdbID, Poster, Type, ShowDetail, DetailRequest, ActivateModal}) => {

    const clickHandler = () => {

        // Display Modal and Loading Icon
        ActivateModal(true);
        DetailRequest(true);
        fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            DetailRequest(false);
            ShowDetail(response);
        })
        .catch(({message}) => {
            DetailRequest(false);
        })
    }

    return (
        <Col xs={24} xl={8} style={{margin: '20px 0'}} className="gutter-row" span={4}>
            <div className="gutter-box" xs={24} xl={8}>
                <Card
                    style={{ width: 200 }}
                    cover={
                        <img style = {{width: 200, height: 300}}
                            alt={Title}
                            src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster}
                        />
                    }
                    onClick={() => clickHandler()}
                >
                    <Meta
                            title={Title}
                            description={false}
                    />
                    <Row style={{marginTop: '10px'}} className="gutter-row">
                        <Col>
                            <Tag color="magenta">{Type}</Tag>
                        </Col>
                    </Row>
                </Card>
            </div>
        </Col>
    )
}

const MovieDetail = ({Title, Poster, imdbRating, Rated, Runtime, Genre, Plot}) => {
    return (
        <Row>
            <Col span={11}>
                <img 
                    src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster} 
                    alt={Title} 
                />
            </Col>
            <Col xs={24} xl={8} span={13}>
                <Row>
                    <Col span={21}>
                        <TextTitle level={4}>{Title}</TextTitle></Col>
                    <Col span={3} style={{textAlign:'right'}}>
                        <TextTitle level={4}><span style={{color: '#41A8F8'}}>{imdbRating}</span></TextTitle>
                    </Col>
                </Row>
                <Row style={{marginBottom: '20px'}}>
                    <Col>
                        <Tag>{Rated}</Tag> 
                        <Tag>{Runtime}</Tag> 
                        <Tag>{Genre}</Tag>
                    </Col>
                </Row>
                <Row>
                    <Col>{Plot}</Col>
                </Row>
            </Col>
        </Row>
    )
}

const Loader = () => (
    <div style={{margin: '20px 0', textAlign: 'center'}}>
        <Spin />
    </div>
)

var dt=[]
function App() {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [q, setQuery] = useState('Avengers');
    const [activateModal, setActivateModal] = useState(false);
    const [detail, setShowDetail] = useState(false);
    const [detailRequest, setDetailRequest] = useState(false);


    useEffect(() => {

        setLoading(true);
        setError(null);
        setData(null);
        if(q==''){
            fetch(`http://www.omdbapi.com/?s=${'Avengers'}&apikey=${API_KEY}`)
            .then(resp => resp)
            .then(resp => resp.json())
            .then(response => {
                if (response.Response === 'False') {
                    setError(response.Error);
                }
                else {
                    setData(response.Search);
                }

                setLoading(false);
            })
            .catch(({message}) => {
                setError(message);
                setLoading(false);
            })
        }

        else{
            // let promises=[];
            // for(let i=1;i<=5;i++)
            //     promises.push(fetch(`http://www.omdbapi.com/?s=${q}&apikey=${API_KEY}&page=${i}`));
            // Promise.all(promises)
            var sz = 1
            fetch(`http://www.omdbapi.com/?s=${q}&apikey=${API_KEY}&page=${sz}`)
            .then(resp => {
                // sz = Number(resp['totalResults']);
                // // console.log(sz+"Fadfss");
                // console.log(resp['Response']+"Sds");
                // sz = sz/10;

                return resp.json();
            }
            )
            .then(data => {
                console.log(data);
                sz=data.totalResults;
                sz=sz/10;
                let dt=[]
            for(let i=1;i<=sz+1;i++)
            {  
            
                fetch(`http://www.omdbapi.com/?s=${q}&apikey=${API_KEY}&page=${i}`)

           // .then(resp => resp)
            .then(resp => resp.json())
            .then(response => {
                if (response.Response === 'False') {
                    setError(response.Error);
                }
                else {
                    dt.push(response.Search);

                    //setData(dt);                   
                }
                var x=[];
                for(let j=0;j<dt.length;j++){
                    for(let k=0;k<dt[j].length;k++){
                        x.push(dt[j][k]);
                    }
                }
                console.log(x);
                setData(x);
                setLoading(false);
                
            })
            .catch(({message}) => {
                setError(message);
                setLoading(false);
            })
        }
    
            })

           
      
        
          
        }
            
    }, [q]);

    
    return (
        <div className="App">
            <Layout className="layout">
                <Header>
                    <div style={{ textAlign: 'center'}}>
                        <TextTitle style={{color: '#ffffff', marginTop: '14px'}} level={3}>My Movies</TextTitle>
                    </div>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#141414', padding: 24, minHeight: 280 }}>
                        <SearchBox searchHandler={setQuery} />
                        <br />
                        
                        <Row gutter={16} type="flex" justify="center">
                            { loading &&
                                <Loader />
                            }

                            { error !== null &&
                                <div style={{margin: '20px 0'}}>
                                    <Alert message={error} type="error" />
                                </div>
                            }
                            {console.log(data)}
                            { data !== null && data.length > 0 && data.map((result, index) => (

                               
                            //    <InfiniteScroll
                            //         dataLength={dt.length} //This is important field to render the next data
                            //         next={dt}
                            //         hasMore={true} 
                                    
                            //    >
                                   
                               <ColCardBox 
                                    ShowDetail={setShowDetail} 
                                    DetailRequest={setDetailRequest}
                                    ActivateModal={setActivateModal}
                                    key={index} 
                                    {...result} 
                                />  
                                   
                                //  </InfiniteScroll>  
                            ))}
                        </Row>
                        
                    </div>
                    <Modal
                        title='About'
                        centered
                        visible={activateModal}
                        onCancel={() => setActivateModal(false)}
                        footer={null}
                        width={800 }
                        >
                        { detailRequest === false ?
                            (<MovieDetail {...detail} />) :
                            (<Loader />) 
                        }
                    </Modal>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Mrinal Shashwat ©2021</Footer>
            </Layout>
        </div>
    );
}

export default App;
