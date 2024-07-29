package com.modernfamily.ukids.domain.letter.entity;

import com.modernfamily.ukids.domain.tree.entity.Tree;
import com.modernfamily.ukids.domain.user.entity.User;
import com.modernfamily.ukids.global.baseTimeEntity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@NoArgsConstructor
@Getter
public class Letter extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long letterId;

    @Column(nullable = false, length = 3000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "tree_id")
    private Tree tree;

    @ManyToOne
    @JoinColumn(name = "from_id", referencedColumnName = "user_id")
    private User fromUser;

    @ManyToOne
    @JoinColumn(name = "to_id", referencedColumnName = "user_id")
    private User toUser;

    @ColumnDefault("false")
    @Column(columnDefinition = "TINYINT(1)")
    private boolean isDelete;

    @ColumnDefault("false")
    @Column(columnDefinition = "TINYINT(1)")
    private boolean isOpen;

    private Letter(String content, Tree tree, User fromUser, User toUser, boolean isDelete, boolean isOpen) {
        this.content = content;
        this.tree = tree;
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.isDelete = isDelete;
        this.isOpen = isOpen;
    }
}
