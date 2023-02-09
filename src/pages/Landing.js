import React, { useState, useEffect } from 'react';

import { grades } from './gradeList';
import  {curriculum}  from './vms2019.json';


function Landing() {
  const [showAddForm, setShowAddForm] = useState(true);
  const [allResults, setAllResults] = useState([]);
  const [cumulativeGpa, setCumulativeGpa] = useState(null);

  useEffect(() => {
    getAllResults();
  }, []);

  const getAllResults = () => {
    localStorage.getItem('@allResults') &&
      setAllResults(JSON.parse(localStorage.getItem('@allResults')));
  };

  const addResultHandler = (result) => {
    console.log(result);
    setAllResults([
      ...allResults,
      {
        ...result,
        courseYear: `${result?.semester}/${result?.year}`,
        id: Math.random(),
      },
    ]);
    localStorage.setItem(
      '@allResults',
      JSON.stringify([
        ...allResults,
        {
          ...result,
          courseYear: `${result?.semester}/${result?.year}`,
          id: Math.random(),
        },
      ])
    );
  };

  const calculateTotalGpa = () => {
    let total = 0;
    let totalSem = 0;
    allResults.map((result) => {
      if (result?.score === '0') {
        total += 0;
        totalSem++;
      }
      if (parseFloat(result.score)) {
        total += parseFloat(result.score);
        totalSem++;
      }
      // total += parseFloat(result?.score !== '' ? result?.score : 0);
      return null;
    });
    console.log(total, allResults?.length);
    setCumulativeGpa(total / totalSem);
  };

  const onDelete = (id) => {
    const updated = allResults.filter((result, i) => result?.id !== id);
    setAllResults(updated);
    localStorage.setItem('@allResults', JSON.stringify(updated));
  };

  const groups = allResults?.reduce((groups, r) => {
    const date = r.courseYear;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(r);
    return groups;
  }, {});

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      courses: groups[date],
    };
  });

  console.log(groupArrays);

  const calculateScore = (arr) => {
    let total = 0;
    let totalSubjects = 0;
    console.log(arr);
    arr.map((result) => {
      // total += parseFloat(result?.score !== '' ? result.score : 0);
      if (result?.score === '0') {
        total += 0;
        totalSubjects++;
      }
        if (parseFloat(result.score)) {
          total += parseFloat(result.score);
          totalSubjects++;
        }
      return null;
    });

    return (total / totalSubjects)?.toFixed(2);
  };

  const getGrade = (score) => {
    if(score === '0') {
      return 'F';
    }
    if (parseFloat(score)) {
      const u = grades.filter((g) => g.value === parseFloat(score));
      console.log(u);
      if (u?.[0]) {
        console.log(u);
        return u[0].label;
      }
      return '';
    } else {
      const u = grades.filter((g) => g.value === score);
      console.log(u);
      if (u?.[0]) {
        console.log(u);
        return u[0].label;
      }
      return '';
    }
  };

  return (
    <div className='dashboard'>
      <div className='container'>
        {/* <div className='row'>
          
          <center>
          <button
            className='btn btn-danger mt-4'
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add Course
            </button></center>
        </div><br></br> */}
        {showAddForm && (
          <div>
            <AddGpa
              allResults={allResults}
              onAddResult={addResultHandler}
              calculateTotalGpa={calculateTotalGpa}
            />
          </div>
        )}

        <div className='list_cont'>
          
          {!!allResults?.length && (
            <center><button
              className='btn btn-danger mt-4'
              onClick={() => {
                setAllResults([]);
                localStorage.removeItem('@allResults');
                setCumulativeGpa(null);
              }}
            >
              Clear
              </button></center>
          )}
          {console.log(allResults)}
          {groupArrays?.map((group, i) => {
            return (
              <div
                key={i}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
               
                {group.courses.map((r, j) => {
                  return (
                    <div className='note' key={j}>
                      <div className='left'>
                        <div className='title'>
                          Sem: {r?.semester} / {r?.year}
                        </div>
                        <div className='desc'>
                          {j + 1}) {r?.subject?.code} {r?.subject?.name}
                        </div>
                      </div>
                      <div className='right'>
                        <span className='' style={{fontFace: 'century gothic'}}>
                          Gpa: {r?.score} Grade: {getGrade(r?.score)}
                        </span>
                        <center>
                          
                          <button
                          className='btn btn-danger '
                          onClick={() => onDelete(r?.id)}
                        
                        >
                          Remove
                        </button></center>
                        
                      </div>
                      
                    </div>


                  );
                })}
                <h6> 
                    {group.date} GPA: {calculateScore(group.courses)}
                </h6>
              </div>
              
            );
          })}

         
        </div>
        
      </div>
    </div>
  );
}
const years = ['2023','2022', '2021', '2020', '2019', '2018', '2017'];
const semester = ['1','2','3']

function AddGpa(props) {
  const { onAddResult, allResults, calculateTotalGpa } = props;
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [courseGroupName, setCourseGroupName] = useState('');
  const [courseSubjects, setCourseSubject] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(grades[0]?.value);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    if (curriculum?.subjects) {
      setCourseGroupName(curriculum.subjects[0]?.groupName);
      setCourseSubject(curriculum.subjects[0]?.subjects);
      setSelectedSubject(curriculum.subjects[0]?.subjects?.[0]);
    }
  }, []);

  const addGpaHandler = () => {
    
    const result = {
        year: selectedYear,
        semester: selectedSemester,
        score: selectedGrade,
        subject: selectedSubject,
        courseGroupName
    }
    onAddResult(result)
  };
  
  return (
    
    <body >
    <div className='login'  >
      <div className='container'>
        <div className='row' >
          <div className='col-md-12 col-lg-12 '>
            <h1 className='display-9'><center>GPA Calculator</center></h1>
          </div>
        </div>
        <div className='row' ><center> 
          <div className='col-md-6 m-auto'>
            <div>
              <select
                className='dropdown dropdown_70'
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years?.map((y, i) => (
                  <option key={i} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                className='dropdown dropdown_30'
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                {semester.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className='dropdown dropdown_100'
                onChange={(e) => {
                  const d = JSON.parse(e.target.value);
                  setCourseGroupName(d.groupName);
                  setCourseSubject(d.subjects);
                  setSelectedSubject(d.subjects?.[0]);
                }}
              >
                {curriculum?.subjects?.map((sub, i) => (
                  <option key={i} value={JSON.stringify(sub)}>
                    {sub?.groupName}
                  </option>
                ))}
              </select><br></br>
              <select
                className='dropdown dropdown_70'
                onChange={(e) => setSelectedSubject(JSON.parse(e.target.value))}
              >
                {courseSubjects?.map((s, i) => (
                  <option key={i} value={JSON.stringify(s)}>
                    {s?.name}
                  </option>
                ))}
              </select><br></br>
              <select
                className='dropdown dropdown_30'
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                {grades?.map((g, i) => (
                  <option key={i} value={g?.value}>
                    {g?.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              style={{ width: '200px'}}
              
              type='submit'
              className='btn btn-danger btn-block mt-4'
              onClick={addGpaHandler}
            >
              Add
            </button>
            <button
              style={{ Align: 'center', width: '200px'}}
              type='submit'
              className='btn btn-primary mt-2 block'
              disabled={allResults.length === 0}
              onClick={calculateTotalGpa}
            >
              Calculate
            </button>
          </div>
          </center></div>
      </div>
    </div></body>
  );
}



export default Landing;