# USR Dashboard

A custom operations system for USR's structural and foundation repair business.

## What This Is

This is our internal company website that helps us manage everything from tracking work hours to calculating crew bonuses. Think of it as our digital headquarters where we handle all the day-to-day operations stuff that keeps the business running smoothly.

## Why We Built This

Running a foundation repair company involves a lot of moving parts - crews working at different job sites, materials being used, bonuses being calculated, and making sure everyone gets paid correctly. We were doing a lot of this manually or with different tools that didn't talk to each other. This system brings it all together in one place.

## What It Does

### For Our Crews
- **Clock in and out with your phone** - GPS makes sure you're actually at the job site
- **See your upcoming jobs** and what materials you'll need
- **Track your bonus earnings** in real-time as you complete work
- **Upload photos** of completed work or issues you find

### For Office Staff
- **Pull in work orders** automatically from JobNimbus (no more manual entry!)
- **Generate material lists** for each job based on what type of work it is
- **Track inventory** and know when we're running low on supplies
- **Run reports** on job profitability and crew performance

### For Management (That's Me!)
- **Override time clock issues** when needed (with full tracking of why)
- **Set bonus rates** for different types of jobs
- **See real-time dashboards** of how we're doing
- **Export everything** for payroll and accounting

## How Bonuses Work

We calculate bonuses based on the type of work being done. For example:
- Helical Piers: 15% of profit
- Encapsulation: 15% of profit  
- Dehumidifier installs: $20 flat per unit

The system automatically calculates profit (revenue minus materials and labor costs) and applies the right percentage. If multiple crew members worked on a job, it splits the bonus based on how many hours each person put in.

## The Technical Stuff

We built this using:
- **Vue.js** for the website interface (what you see and click)
- **Express.js** for the backend (the brain that processes everything)
- **PostgreSQL** database (where we store all the data)
- **JobNimbus integration** (pulls in our work orders automatically)

It works on phones, tablets, and computers. The time clock is designed to work well on phones since that's what crews use in the field.

## Security & Privacy

- Everyone has their own login with different permission levels
- GPS data is only used for verifying work locations
- All sensitive actions (like bonus overrides) are logged with who did what and when
- Regular backups so we never lose data

## Who Uses This

This is just for USR employees:
- **Field crews** - clock in/out, see jobs, track bonuses
- **Office staff** - manage jobs, inventory, run reports  
- **Management** - oversight, approvals, system configuration

## Getting Started

*[Installation and setup instructions would go here for developers]*

## Questions or Issues?

Contact Jeremy (that's me) if you need help with the system or have ideas for improvements.

---

*This system is custom-built for USR's specific needs. It's not a off-the-shelf product - we made it ourselves to solve our exact problems.*
