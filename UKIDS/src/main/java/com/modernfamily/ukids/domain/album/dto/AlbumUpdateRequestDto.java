package com.modernfamily.ukids.domain.album.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AlbumUpdateRequestDto {

    @NotNull
    Long albumId;

    @NotNull
    Long familyId;

    @NotBlank
    String title;

    @NotNull
    LocalDate date;
}
