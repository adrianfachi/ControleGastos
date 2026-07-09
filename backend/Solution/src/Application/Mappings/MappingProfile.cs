using Application.DTOs.TransactionsDTOs;
using Application.DTOs.UserDTOs;
using AutoMapper;
using Domain;

namespace Application.Mappings
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
    {
        CreateMap<UpdateTransactionDto, Transaction>()
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            
        
        CreateMap<UpdateUserDto, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
    }
}