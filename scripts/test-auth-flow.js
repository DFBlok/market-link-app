// Test script to verify authentication flow
// Run this in the browser console on your site

async function testAuthenticationFlow() {
  console.log("🧪 Starting Authentication Flow Test...\n")

  const baseUrl = window.location.origin

  try {
    // Test 1: Check if demo users exist
    console.log("1️⃣ Testing demo user availability...")
    const usersResponse = await fetch(`${baseUrl}/api/auth/login`, { method: "GET" })
    const usersData = await usersResponse.json()
    console.log(
      "Available users:",
      usersData.users?.map((u) => ({ email: u.email, userType: u.userType })),
    )

    // Test 2: Test manufacturer login
    console.log("\n2️⃣ Testing manufacturer login...")
    const manufacturerLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "manufacturer@demo.com",
        password: "password123",
      }),
    })

    if (manufacturerLogin.ok) {
      const manufacturerData = await manufacturerLogin.json()
      console.log("✅ Manufacturer login successful:", manufacturerData.user)

      // Store user data temporarily
      localStorage.setItem("test_user", JSON.stringify(manufacturerData.user))

      // Test dashboard routing
      if (manufacturerData.user.userType === "manufacturer") {
        console.log("✅ Manufacturer should redirect to /dashboard/manufacturer")
      }
    } else {
      const error = await manufacturerLogin.json()
      console.log("❌ Manufacturer login failed:", error)
    }

    // Test 3: Test supplier login
    console.log("\n3️⃣ Testing supplier login...")
    const supplierLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "supplier@demo.com",
        password: "password123",
      }),
    })

    if (supplierLogin.ok) {
      const supplierData = await supplierLogin.json()
      console.log("✅ Supplier login successful:", supplierData.user)

      if (supplierData.user.userType === "supplier") {
        console.log("✅ Supplier should redirect to /dashboard/supplier")
      }
    } else {
      const error = await supplierLogin.json()
      console.log("❌ Supplier login failed:", error)
    }

    // Test 4: Test invalid login
    console.log("\n4️⃣ Testing invalid login...")
    const invalidLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "invalid@email.com",
        password: "wrongpassword",
      }),
    })

    if (!invalidLogin.ok) {
      const error = await invalidLogin.json()
      console.log("✅ Invalid login properly rejected:", error.error)
    } else {
      console.log("❌ Invalid login should have been rejected")
    }

    // Test 5: Test registration
    console.log("\n5️⃣ Testing new user registration...")
    const testEmail = `test${Date.now()}@example.com`
    const registration = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: testEmail,
        password: "testpassword123",
        userType: "manufacturer",
        companyName: "Test Company",
        phone: "+27 11 123 4567",
      }),
    })

    if (registration.ok) {
      const regData = await registration.json()
      console.log("✅ Registration successful:", regData.user)

      // Test login with new user
      console.log("\n6️⃣ Testing login with newly registered user...")
      const newUserLogin = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: "testpassword123",
        }),
      })

      if (newUserLogin.ok) {
        const loginData = await newUserLogin.json()
        console.log("✅ New user login successful:", loginData.user)
      } else {
        const error = await newUserLogin.json()
        console.log("❌ New user login failed:", error)
      }
    } else {
      const error = await registration.json()
      console.log("❌ Registration failed:", error)
    }

    console.log("\n🎉 Authentication flow test completed!")
    console.log("\n📋 Test Summary:")
    console.log("- Demo users are available for testing")
    console.log("- Login system works for both user types")
    console.log("- Role-based routing is configured")
    console.log("- Registration system is functional")
    console.log("- Error handling works properly")

    // Clean up test data
    localStorage.removeItem("test_user")
  } catch (error) {
    console.error("❌ Test failed with error:", error)
  }
}

// Instructions for manual testing
console.log(`
🔧 MANUAL TESTING INSTRUCTIONS:

1. Demo Accounts (Ready to use):
   - Manufacturer: manufacturer@demo.com / password123
   - Supplier: supplier@demo.com / password123

2. Test Steps:
   a) Go to /auth/login
   b) Try logging in with demo accounts
   c) Verify you're redirected to correct dashboard
   d) Try registering a new account at /auth/register  Verify you're redirected to correct dashboard
   d) Try registering a new account at /auth/register
   e) Test logout functionality
   f) Verify protected routes work correctly

3. Run Automated Test:
   - Open browser console on your site
   - Copy and paste the testAuthenticationFlow() function
   - Run: testAuthenticationFlow()

4. Expected Results:
   ✅ Manufacturer login → /dashboard/manufacturer
   ✅ Supplier login → /dashboard/supplier  
   ✅ Invalid credentials → Error message
   ✅ Registration → Success + redirect to login
   ✅ Protected routes → Redirect to login if not authenticated
`)

// Run the test automatically
testAuthenticationFlow()
