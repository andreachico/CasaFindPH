# 🏡 CasaFind.ph

**CasaFind.ph** is a modern real estate marketplace for the Philippines.  
It connects property seekers, sellers, and agents on a simple and trustworthy platform — with powerful search, verified listings, and a mobile-first experience.  

Built using **GraphQL + MySQL**, the platform is designed to be fast, flexible, and scalable for long-term growth.  

---

## ✨ Key Features

- 🔍 **For Buyers & Renters**: Easy search, verified listings, and direct contact with property owners and agents.  
- 📢 **For Sellers & Agents**: Wider exposure, affordable listing options, and a modern, mobile-friendly platform.  
- 🌍 **For OFWs**: A trusted place to explore and invest in Philippine properties from anywhere in the world.  

---

## 🚀 Tech Stack

- **Database**: MySQL (structured property and user data)  
- **Backend**: Node.js + Apollo Server (GraphQL API)  
- **ORM**: Prisma (database access and schema management)  
- **Frontend**: React / Next.js (with Apollo Client)  
- **Hosting**: [to decide: e.g., Vercel, DigitalOcean, AWS]  

---

## 📌 Roadmap

- [ ] MVP launch with property search + listing features  
- [ ] User authentication (buyers, sellers, agents)  
- [ ] Agent dashboard for managing listings  
- [ ] Premium listings & subscription options  
- [ ] Mobile app (future phase)  

---

## 🛠️ Example GraphQL Query

```graphql
query {
  properties(location: "Makati", minPrice: 20000, maxPrice: 80000, propertyType: "condo") {
    id
    title
    price
    bedrooms
    bathrooms
    location
    listedBy {
      name
      role
    }
  }
}
