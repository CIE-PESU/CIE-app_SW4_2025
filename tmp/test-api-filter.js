
async function testApi() {
  const userId = 'cmmu7r49x0000grtopo7a9iu4' // Anant Sharma UserID from earlier check
  const baseUrl = 'http://localhost:3001/api/students'

  console.log('Testing /api/students with x-user-id header...')
  const res1 = await fetch(baseUrl, {
    headers: { 'x-user-id': userId }
  })
  const data1 = await res1.json()
  console.log(`Results with header: ${data1.students.length} student(s)`)
  if (data1.students.length === 1 && data1.students[0].user_id === userId) {
    console.log('✅ PASS: Filtered correctly')
  } else {
    console.log('❌ FAIL: Filtering failed')
  }

  console.log('\nTesting /api/students WITHOUT x-user-id header...')
  const res2 = await fetch(baseUrl)
  const data2 = await res2.json()
  console.log(`Results without header: ${data2.students.length} student(s)`)
  if (data2.students.length > 1) {
    console.log('✅ PASS: Returned multiple students (admin view)')
  } else {
    console.log('❌ FAIL: Should return all students for admins')
  }
}

testApi().catch(console.error)
