package com.modernfamily.ukids.domain.growthRecord.model.service;

import com.modernfamily.ukids.domain.growthFolder.model.repository.GrowthFolderRepository;
import com.modernfamily.ukids.domain.growthRecord.dto.GrowthRecordRequestDto;
import com.modernfamily.ukids.domain.growthRecord.dto.GrowthRecordResponseDto;
import com.modernfamily.ukids.domain.growthRecord.dto.GrowthRecordUpdateDto;
import com.modernfamily.ukids.domain.growthRecord.entity.GrowthRecord;
import com.modernfamily.ukids.domain.growthRecord.mapper.GrowthRecordMapper;
import com.modernfamily.ukids.domain.growthRecord.model.repository.GrowthRecordRepository;
import com.modernfamily.ukids.domain.user.dto.CustomUserDetails;
import com.modernfamily.ukids.domain.user.entity.User;
import com.modernfamily.ukids.domain.user.model.repository.UserRepository;
import com.modernfamily.ukids.global.exception.CustomException;
import com.modernfamily.ukids.global.exception.ExceptionResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrowthRecordServiceImpl implements GrowthRecordService{

    private final GrowthRecordRepository growthRecordRepository;
    private final GrowthRecordMapper growthRecordMapper;
    private final UserRepository userRepository;
    private final GrowthFolderRepository growthFolderRepository;

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    public GrowthRecordResponseDto createGrowthRecord(GrowthRecordRequestDto growthRecordRequestDto) {
        System.out.println(growthRecordRequestDto.getFolderId());
        growthFolderRepository.findByFolderId(growthRecordRequestDto.getFolderId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_GROWTHFOLDER_EXCEPTION));

        String id = CustomUserDetails.contextGetUserId();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        // 추후 userId와 familyId로 FamilyMember를 조회 후 자식일 경우 20살 이상인지 판별

        growthRecordRequestDto.setWriterId(user.getUserId());

        System.out.println(growthRecordMapper.toGrowthRecordRequestEntity(growthRecordRequestDto).getFolder().getFolderId());
        GrowthRecord growthRecord = growthRecordRepository.save(growthRecordMapper.toGrowthRecordRequestEntity(growthRecordRequestDto));

        return growthRecordMapper.toGrowthRecordResponseDto(growthRecord);
    }

    @Override
    @Transactional
    public GrowthRecordResponseDto updateGrowthRecord(GrowthRecordUpdateDto growthRecordUpdate) {
        GrowthRecord growthRecordInfo = growthRecordRepository.findByRecordId(growthRecordUpdate.getRecordId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_GROWTHRECORD_EXCEPTION));

        String id = CustomUserDetails.contextGetUserId();
        User user = userRepository.findById(id)
                        .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));
        if(user.getUserId() != growthRecordInfo.getUser().getUserId()){
            throw new ExceptionResponse(CustomException.NOT_SAME_WRITER_EXCEPTION);
        }

        growthRecordRepository.updateGrowthRecord(growthRecordMapper.toGrowthRecordUpdateEntity(growthRecordUpdate));

        entityManager.flush();
        entityManager.clear();

        GrowthRecord growthRecord = growthRecordRepository.findByRecordId(growthRecordUpdate.getRecordId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_GROWTHRECORD_EXCEPTION));

        return growthRecordMapper.toGrowthRecordResponseDto(growthRecord);
    }

    @Override
    public GrowthRecordResponseDto getGrowthRecord(Long recordId) {
        GrowthRecord growthRecord = growthRecordRepository.findByRecordId(recordId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_GROWTHRECORD_EXCEPTION));



        return growthRecordMapper.toGrowthRecordResponseDto(growthRecord);
    }

    @Override
    public List<GrowthRecordResponseDto> getGrowthRecords(Long folderId) {
        growthFolderRepository.findByFolderId(folderId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_GROWTHFOLDER_EXCEPTION));

        List<GrowthRecord> growthRecords = growthRecordRepository.getGrowthRecords(folderId);

        return growthRecordMapper.toGrowthRecordResponseDtoList(growthRecords);
    }

    @Override
    public void deleteGrowthRecord(Long recordId) {
        GrowthRecord growthRecord = growthRecordRepository.findByRecordId(recordId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_GROWTHRECORD_EXCEPTION));

        String id = CustomUserDetails.contextGetUserId();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));
        if(user.getUserId() != growthRecord.getUser().getUserId()){
            throw new ExceptionResponse(CustomException.NOT_SAME_WRITER_EXCEPTION);
        }

        growthRecordRepository.deleteGrowthRecord(recordId);
    }
}
