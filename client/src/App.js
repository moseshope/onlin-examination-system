import React, { useState, useEffect, useRef } from 'react';
import { Menu, Layout, Radio, Col, Row } from 'antd';
import './SyncScroll.css';
import logo from './logo.jpeg';
import axios from "axios";

const { Header, Content, Footer } = Layout;

const getProblems = async (limit) => {
  try {
    const res = await axios.post('http://localhost:5000/api/problems/getProblems', { limit });
    return res.data;
  } catch (err) {
    console.log('Error fetching problems:', err);
    return [];
  }
}

const App = () => {
  const limit = 7;
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState('');
  const problemRefs = useRef({});
  const [examProblems, setExamProblems] = useState([]);
  useEffect(() => {
    const fetchProblems = async () => {
      const examProblemsResponse = await getProblems(limit);
      setExamProblems(examProblemsResponse.problems);
    };

    fetchProblems();
  }, [limit]);

  useEffect(() => {
    if (Array.isArray(examProblems)) {  // Ensure examProblems is an array
      setProblems(examProblems.map((_, index) => ({
        id: `problem${index + 1}`,
        label: `Question ${index + 1}`
      })));
    } else {
      console.error('Expected array but got:', examProblems);
    }
  },[examProblems]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveProblem(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    problems.forEach((problem) => {
      if (problemRefs.current[problem.id]) {
        observer.observe(problemRefs.current[problem.id]);
      }
    });

    return () => {
      problems.forEach((problem) => {
        if (problemRefs.current[problem.id]) {
          observer.unobserve(problemRefs.current[problem.id]);
        }
      });
    };
  }, [problems]);

  const handleMenuClick = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} width={80} alt="Logo" />
      </Header>
      <div className='px-5'>
        <div className="wrap">
          <nav className="side-menu">
            <ul>
              {problems.map((problem) => (
                <li
                  key={problem.id}
                  className={activeProblem === problem.id ? 'active' : ''}
                >
                  <button onClick={() => handleMenuClick(problem.id)}>
                    {problem.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="content">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                id={problem.id}
                ref={(el) => problemRefs.current[problem.id] = el}
                className="problem"
              >
                <h2>{problem.label}</h2>
                <p className='prob-content text-blue-700'>{examProblems[index].prob_content}</p>
                <Radio.Group className=' w-full p-5' onChange={(checkedValue) => {
                  setExamProblems(prev => {
                    let tmp = [...prev];
                    tmp[index].result = checkedValue.target.value;
                    return tmp;
                  })
                }}>
                  <Row>
                {examProblems[index].avail_answers.map((availAnswer, i) => (
                      <Col span={24} className='w-full'>
                        <Radio value={i} className=' select-answer w-full text-[25px] my-[20px] font-normal tracking-wide'>{availAnswer}</Radio>
                      </Col>
                ))}
                </Row>
                </Radio.Group>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
