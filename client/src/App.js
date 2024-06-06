import React, { useState, useEffect, useRef } from 'react';
import { Menu, Layout } from 'antd';
import './SyncScroll.css';
import logo from './logo.jpeg';
import axios from "axios";

const { Header, Content, Footer } = Layout;


const getProblems = async (limit) => {
  await axios.post('http://localhost:5000/api/problems/getProblems', {limit: limit})
  .then(res => {
    console.log(res);
    return res;
  })
  .catch(err => {
    console.log(err);
  })
}

const App = () => {
  const limit = 7;
  const [activeProblem, setActiveProblem] = useState('');
  const examProblems = getProblems(limit);
  const problems = [
    { id: 'problem1', label: 'Problem 1' },
    { id: 'problem2', label: 'Problem 2' },
    { id: 'problem3', label: 'Problem 3' },
    { id: 'problem4', label: 'Problem 4' },
    { id: 'problem5', label: 'Problem 5' },
    { id: 'problem6', label: 'Problem 6' },
    { id: 'problem7', label: 'Problem 7' },
    { id: 'problem8', label: 'Problem 8' },
    { id: 'problem9', label: 'Problem 9' },
  ];

  // Initialize refs statically in the component scope
  const problemRefs = {
    problem1: useRef(null),
    problem2: useRef(null),
    problem3: useRef(null),
    problem4: useRef(null),
    problem5: useRef(null),
    problem6: useRef(null),
    problem7: useRef(null),
    problem8: useRef(null),
    problem9: useRef(null),
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.53,
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
      if (problemRefs[problem.id].current) {
        observer.observe(problemRefs[problem.id].current);
      }
    });

    return () => {
      problems.forEach((problem) => {
        if (problemRefs[problem.id].current) {
          observer.unobserve(problemRefs[problem.id].current);
        }
      });
    };
  }, [problems, problemRefs]);

  const handleMenuClick = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} width={80}></img>
      </Header>
      <div className=' px-5'>
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
            {problems.map((problem) => (
              <div
                key={problem.id}
                id={problem.id}
                ref={problemRefs[problem.id]}
                className="problem"
              >
                <h2>{problem.label}</h2>
                <p>Content for {problem.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
