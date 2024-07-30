package com.modernfamily.ukids.domain.user.mapper;

import com.modernfamily.ukids.domain.user.dto.SignUpDto;
import com.modernfamily.ukids.domain.user.dto.UserOtherDto;
import com.modernfamily.ukids.domain.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    User toSignUpEntity(SignUpDto dto);

    UserOtherDto toUserOtherDto(User user);
}
