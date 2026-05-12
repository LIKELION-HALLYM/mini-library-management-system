import {
  createBook,
  shallowCopyBook,
  deepCopyBook,
  buildRefChain,
  cutChain,
  createCounter,
  getBoundIncrement,
  Member,
  getMemberCity,
  getFirstGenre,
  notifyMember,
} from "./index.js";
import { describe, vi } from "vitest";

describe("mini-library-management-system", () => {
  describe("PART 1. 객체 & 참조 복사", () => {
    describe("createBook", () => {
      test("책 객체를 올바르게 생성한다", () => {
        const book = createBook("어린왕자", "생텍쥐페리", 1943);

        expect(book.title).toBe("어린왕자");
        expect(book.author).toBe("생텍쥐페리");
        expect(book.year).toBe(1943);
        expect(book.tags).toEqual([]);
        expect(Array.isArray(book.tags)).toBe(true);
      });

      test("다양한 타입의 입력으로 책을 생성한다", () => {
        const book1 = createBook("1984", "조지 오웰", 1949);
        const book2 = createBook("해리포터", "J.K. 롤링", 1997);

        expect(book1.tags).toEqual([]);
        expect(book2.tags).toEqual([]);
      });
    });

    describe("shallowCopyBook", () => {
      test("얕은 복사본을 생성한다", () => {
        const original = createBook("원본", "작가", 2020);
        original.tags.push("소설");

        const copy = shallowCopyBook(original);

        expect(copy).not.toBe(original);
        expect(copy.title).toBe(original.title);
        expect(copy.author).toBe(original.author);
        expect(copy.year).toBe(original.year);
        expect(copy.tags).toBe(original.tags); // 같은 배열 참조
      });

      test("원본의 프로퍼티를 변경해도 복사본에 영향이 없다 (tags 제외)", () => {
        const original = createBook("원본", "작가", 2020);
        const copy = shallowCopyBook(original);

        original.title = "변경된 제목";

        expect(copy.title).toBe("원본");
      });

      test("tags 배열은 원본과 공유된다", () => {
        const original = createBook("원본", "작가", 2020);
        const copy = shallowCopyBook(original);

        original.tags.push("추가된 태그");

        expect(copy.tags).toEqual(["추가된 태그"]);
        expect(copy.tags).toBe(original.tags);
      });
    });

    describe.skip("deepCopyBook", () => {
      test("깊은 복사본을 생성한다", () => {
        const original = createBook("원본", "작가", 2020);
        original.tags.push("소설", "모험");

        const copy = deepCopyBook(original);

        expect(copy).not.toBe(original);
        expect(copy.title).toBe(original.title);
        expect(copy.author).toBe(original.author);
        expect(copy.year).toBe(original.year);
        expect(copy.tags).not.toBe(original.tags); // 다른 배열
        expect(copy.tags).toEqual(original.tags);
      });

      test("중첩된 객체도 깊게 복사된다", () => {
        const original = {
          title: "복잡한 책",
          metadata: {
            publisher: "출판사",
            location: {
              country: "한국",
              city: "서울",
            },
          },
          tags: ["소설"],
        };

        const copy = deepCopyBook(original);

        copy.metadata.location.city = "부산";
        copy.tags.push("추가됨");

        expect(original.metadata.location.city).toBe("서울");
        expect(original.tags).toEqual(["소설"]);
      });

      test("배열도 깊게 복사된다", () => {
        const original = [1, { nested: "value" }, [2, 3]];
        const copy = deepCopyBook(original);

        copy[1].nested = "changed";
        copy[2].push(4);

        expect(original[1].nested).toBe("value");
        expect(original[2]).toEqual([2, 3]);
      });

      test("원시값은 그대로 반환된다", () => {
        expect(deepCopyBook(42)).toBe(42);
        expect(deepCopyBook("string")).toBe("string");
        expect(deepCopyBook(true)).toBe(true);
        expect(deepCopyBook(null)).toBe(null);
        expect(deepCopyBook(undefined)).toBe(undefined);
      });
    });
  });

  describe("PART 2. 가비지 컬렉션 — 참조 추적 유틸", () => {
    describe("buildRefChain", () => {
      test("체인을 올바르게 구축한다", () => {
        const section = { name: "소설" };
        const shelf = { name: "A-1" };
        const book = { title: "어린왕자" };

        const result = buildRefChain(section, shelf, book);

        expect(result).toBe(section);
        expect(section.next).toBe(shelf);
        expect(shelf.next).toBe(book);
      });
    });

    describe("cutChain", () => {
      test("체인을 끊고 shelf 객체를 반환한다", () => {
        const section = { name: "소설" };
        const shelf = { name: "A-1" };
        const book = { title: "어린왕자" };

        buildRefChain(section, shelf, book);
        const cutShelf = cutChain(section);

        expect(cutShelf).toBe(shelf);
        expect(section.next).toBe(null);
        expect(shelf.next).toBe(book); // shelf의 다음 링크는 유지
      });
    });
  });

  describe("PART 3. 메서드 & this", () => {
    describe("createCounter", () => {
      test("카운터 객체를 올바르게 생성한다", () => {
        const counter = createCounter();

        expect(counter.count).toBe(0);
        expect(typeof counter.increment).toBe("function");
        expect(typeof counter.decrement).toBe("function");
        expect(typeof counter.reset).toBe("function");
      });

      test("increment가 count를 증가시킨다", () => {
        const counter = createCounter();

        expect(counter.increment()).toBe(1);
        expect(counter.increment()).toBe(2);
        expect(counter.count).toBe(2);
      });

      test("decrement가 count를 감소시킨다", () => {
        const counter = createCounter();
        counter.count = 3;

        expect(counter.decrement()).toBe(2);
        expect(counter.decrement()).toBe(1);
        expect(counter.count).toBe(1);
      });

      test("count가 0일 때 decrement는 에러를 발생시킨다", () => {
        const counter = createCounter();

        expect(() => counter.decrement()).toThrow("count cannot be negative");
      });

      test("reset이 count를 0으로 초기화한다", () => {
        const counter = createCounter();
        counter.count = 5;

        expect(counter.reset()).toBe(undefined);
        expect(counter.count).toBe(0);
      });
    });

    describe.skip("getBoundIncrement", () => {
      test("바인딩된 increment 함수를 반환한다", () => {
        const counter = createCounter();
        const boundIncrement = getBoundIncrement(counter);

        expect(typeof boundIncrement).toBe("function");

        const result = boundIncrement();
        expect(result).toBe(1);
        expect(counter.count).toBe(1);
      });

      test("단독으로 호출해도 동작한다", () => {
        const counter = createCounter();
        const boundIncrement = getBoundIncrement(counter);

        // this를 잃어버린 상황에서도 동작해야 함
        const increment = boundIncrement;

        expect(increment()).toBe(1);
        expect(increment()).toBe(2);
        expect(counter.count).toBe(2);
      });
    });
  });

  describe("PART 4. 생성자 함수", () => {
    describe.skip("Member", () => {
      test("new로 호출하면 회원 객체를 생성한다", () => {
        const member = new Member("홍길동");

        expect(member.name).toBe("홍길동");
        expect(member.borrowedBooks).toEqual([]);
        expect(Array.isArray(member.borrowedBooks)).toBe(true);
      });

      test("new 없이 호출하면 에러를 발생시킨다", () => {
        expect(() => Member("홍길동")).toThrow(
          "Member must be called with new",
        );
      });

      describe("borrow", () => {
        test("책을 대출하고 this를 반환한다", () => {
          const member = new Member("홍길동");
          const book = createBook("책1", "작가1", 2020);

          const result = member.borrow(book);

          expect(result).toBe(member); // 체이닝을 위해 this 반환
          expect(member.borrowedBooks).toHaveLength(1);
          expect(member.borrowedBooks[0]).toBe(book);
        });

        test("여러 권의 책을 대출할 수 있다", () => {
          const member = new Member("홍길동");
          const book1 = createBook("책1", "작가1", 2020);
          const book2 = createBook("책2", "작가2", 2021);

          member.borrow(book1).borrow(book2);

          expect(member.borrowedBooks).toHaveLength(2);
          expect(member.borrowedBooks[0]).toBe(book1);
          expect(member.borrowedBooks[1]).toBe(book2);
        });
      });

      describe("returnBook", () => {
        test("책을 반납하고 제거된 책 객체를 반환한다", () => {
          const member = new Member("홍길동");
          const book = createBook("책1", "작가1", 2020);

          member.borrow(book);
          const returnedBook = member.returnBook("책1");

          expect(returnedBook).toBe(book);
          expect(member.borrowedBooks).toHaveLength(0);
        });

        test("없는 책을 반납하면 null을 반환한다", () => {
          const member = new Member("홍길동");

          const result = member.returnBook("없는책");

          expect(result).toBe(null);
        });

        test("여러 권 중 특정 책만 반납한다", () => {
          const member = new Member("홍길동");
          const book1 = createBook("책1", "작가1", 2020);
          const book2 = createBook("책2", "작가2", 2021);
          const book3 = createBook("책3", "작가3", 2022);

          member.borrow(book1).borrow(book2).borrow(book3);
          const returned = member.returnBook("책2");

          expect(returned).toBe(book2);
          expect(member.borrowedBooks).toHaveLength(2);
          expect(member.borrowedBooks[0]).toBe(book1);
          expect(member.borrowedBooks[1]).toBe(book3);
        });
      });

      describe("getSummary", () => {
        test("대출 현황 요약을 반환한다", () => {
          const member = new Member("홍길동");

          expect(member.getSummary()).toBe("홍길동님의 대출 현황: 0권");

          member.borrow(createBook("책1", "작가1", 2020));
          expect(member.getSummary()).toBe("홍길동님의 대출 현황: 1권");

          member.borrow(createBook("책2", "작가2", 2021));
          expect(member.getSummary()).toBe("홍길동님의 대출 현황: 2권");
        });
      });
    });
  });

  describe("PART 5. 옵셔널 체이닝 & Nullish 병합", () => {
    describe("getMemberCity", () => {
      test("정상적인 회원 데이터에서 도시를 반환한다", () => {
        const member = {
          address: {
            city: "서울",
          },
        };

        expect(getMemberCity(member)).toBe("서울");
      });

      test('member가 null이면 "unknown"을 반환한다', () => {
        expect(getMemberCity(null)).toBe("unknown");
        expect(getMemberCity(undefined)).toBe("unknown");
      });

      test('address가 없으면 "no address"를 반환한다', () => {
        const member = { name: "홍길동" };

        expect(getMemberCity(member)).toBe("no address");
      });

      test('address가 null이면 "no address"를 반환한다', () => {
        const member = {
          address: null,
        };

        expect(getMemberCity(member)).toBe("no address");
      });

      test('city가 없으면 "no city"를 반환한다', () => {
        const member = {
          address: {
            country: "한국",
          },
        };

        expect(getMemberCity(member)).toBe("no city");
      });

      test('city가 null이면 "no city"를 반환한다', () => {
        const member = {
          address: {
            city: null,
          },
        };

        expect(getMemberCity(member)).toBe("no city");
      });
    });

    describe("getFirstGenre", () => {
      test("정상적인 장르 목록에서 첫 번째 장르를 반환한다", () => {
        const member = {
          preferences: {
            genres: ["소설", "모험", "로맨스"],
          },
        };

        expect(getFirstGenre(member)).toBe("소설");
      });

      test('member가 null이면 "장르 없음"을 반환한다', () => {
        expect(getFirstGenre(null)).toBe("장르 없음");
        expect(getFirstGenre(undefined)).toBe("장르 없음");
      });

      test('preferences가 없으면 "장르 없음"을 반환한다', () => {
        const member = { name: "홍길동" };

        expect(getFirstGenre(member)).toBe("장르 없음");
      });

      test('genres가 없으면 "장르 없음"을 반환한다', () => {
        const member = {
          preferences: {
            language: "한국어",
          },
        };

        expect(getFirstGenre(member)).toBe("장르 없음");
      });

      test('genres 배열이 비어 있으면 "장르 없음"을 반환한다', () => {
        const member = {
          preferences: {
            genres: [],
          },
        };

        expect(getFirstGenre(member)).toBe("장르 없음");
      });
    });

    describe("notifyMember", () => {
      test("notifyDue 메서드가 있으면 호출하고 결과를 반환한다", () => {
        const member = {
          notifyDue: vi.fn().mockReturnValue("알림 전송 완료"),
        };

        const result = notifyMember(member);

        expect(member.notifyDue).toHaveBeenCalled();
        expect(result).toBe("알림 전송 완료");
      });

      test('notifyDue 메서드가 없으면 "알림 기능 없음"을 반환한다', () => {
        const member = { name: "홍길동" };

        expect(notifyMember(member)).toBe("알림 기능 없음");
      });

      test('member가 null이면 "알림 기능 없음"을 반환한다', () => {
        expect(notifyMember(null)).toBe("알림 기능 없음");
        expect(notifyMember(undefined)).toBe("알림 기능 없음");
      });
    });
  });
});
