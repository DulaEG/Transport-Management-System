import React from 'react'
import DriverSideBar from './DriverSideBar'
import './MaintenanceHome.scoped.css'
import { Link } from 'react-router-dom'



function Home() {
  return (
    <div >
      <DriverSideBar/>

      <div class="card-container1">
        <div class="box1">
        <img src="./images/service.jpg" alt="" className="card-image" />
        <p>"Ensure your fleet stays in top condition with our comprehensive vehicle services. From routine maintenance to specialized repairs, we offer reliable solutions that enhance performance, extend vehicle lifespan, and minimize downtime.
        Trust our expert technicians to keep your vehicles running smoothly, ensuring safety and efficiency on the road."</p>
        <br></br>
        <Link to="/ServiceDr">
        <button>Services</button>
        </Link>
        </div>
       </div>

       <div class="card-container1">
        <div class="box2">
        <img src="./images/repair.jpeg" alt="" className="card-image1" />
        <p>"Get fast and efficient vehicle repair services to minimize downtime and get your vehicles back on the road. Our skilled technicians handle everything from minor fixes to major repairs, using high-quality parts and advanced tools to
           ensure reliable, long-lasting results."</p>
        <br></br>
        <Link to="/RepairDr">
        <button>Repairs</button>
        </Link>
        </div>
       </div>

       <div class="card-container1">
        <div class="box1">
        <img src="./images/beeakdown.jpg" alt="" className="card-image" />
        <p>"Quickly resolve unexpected vehicle breakdowns with our responsive repair services. Our expert team provides on-site
           and off-site assistance to ensure your vehicles are back in operation swiftly, minimizing disruptions and keeping your business moving."
        </p>
        <br></br>
        <Link to="/BreakdownDR">
        <button >Breakdowns</button>
        </Link>
        </div>
       </div>

    </div>

  )
}

export default Home
