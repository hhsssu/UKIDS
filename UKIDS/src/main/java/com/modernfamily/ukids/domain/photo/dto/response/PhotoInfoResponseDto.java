package com.modernfamily.ukids.domain.photo.dto.response;

import com.modernfamily.ukids.domain.album.dto.response.AlbumInfoResponseDto;
import com.modernfamily.ukids.domain.family.dto.FamilyResponseDto;
import com.modernfamily.ukids.domain.photo.entity.Photo;
import lombok.Builder;
import lombok.Getter;

@Getter
public class PhotoInfoResponseDto {

    Long photoId;

    String fileName;

    String imgUrl;

    AlbumInfoResponseDto album;

    @Builder
    private PhotoInfoResponseDto(Long photoId, String fileName, String imgUrl, AlbumInfoResponseDto album) {
        this.photoId = photoId;
        this.fileName = fileName;
        this.imgUrl = imgUrl;
        this.album = album;
    }

    public static PhotoInfoResponseDto createResponseDto(Photo photo, FamilyResponseDto familyResponseDto) {
        return PhotoInfoResponseDto.builder()
                .photoId(photo.getPhotoId())
                .fileName(photo.getPhotoOriginalName())
                .imgUrl(photo.getPhotoUrl())
                .album(AlbumInfoResponseDto.createAlbumInfoResponseDto(photo.getAlbum(), familyResponseDto))
                .build();
    }

}