package com.example.blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.blog.AccountVo;

@Repository
public interface UserProfileRepository extends JpaRepository<AccountVo, Long>{
	// 你可以在這裡定義一些自定義查詢方法，比如通過標題查詢文章
    //Spring Data JPA 使用方法名稱來推斷查詢邏輯。只要你新增的方法名稱不與預設方法重名，這些方法就能獨立運作，互不干涉。
    //自定義方法findBy:查詢 Title:屬性名稱 Containing:
}
