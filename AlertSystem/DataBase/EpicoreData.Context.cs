﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AlertSystem.DataBase
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class SaaS1143_62653Entities : DbContext
    {
        public SaaS1143_62653Entities()
            : base("name=SaaS1143_62653Entities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<JobHead> JobHeads { get; set; }
        public virtual DbSet<JobMtl> JobMtls { get; set; }
        public virtual DbSet<JobOpDtl> JobOpDtls { get; set; }
        public virtual DbSet<JobOper> JobOpers { get; set; }
        public virtual DbSet<Part> Parts { get; set; }
        public virtual DbSet<PartBin> PartBins { get; set; }
        public virtual DbSet<PartTran> PartTrans { get; set; }
        public virtual DbSet<PartWhse> PartWhses { get; set; }
        public virtual DbSet<PODetail> PODetails { get; set; }
        public virtual DbSet<RcvHead> RcvHeads { get; set; }
    }
}
