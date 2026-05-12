"use strict";

// ─────────────────────────────────────────────────────
// PART 1. 객체 & 참조 복사
// ─────────────────────────────────────────────────────

/**
 * 책 한 권을 나타내는 객체를 생성해 반환한다.
 * @param {string} title
 * @param {string} author
 * @param {number} year
 * @returns {{ title: string, author: string, year: number, tags: string[] }}
 *
 * 조건: tags는 반드시 빈 배열로 초기화할 것.
 */
export function createBook(title, author, year) {
  // TODO
}

/**
 * 주어진 book 객체의 얕은 복사본을 반환한다.
 * 원본 book의 title을 바꿔도 복사본에는 영향이 없어야 한다.
 * 하지만 tags 배열은 원본과 공유된다(얕은 복사의 특성).
 *
 * @param {object} book
 * @returns {object}
 */
export function shallowCopyBook(book) {
  // TODO
}

// ─────────────────────────────────────────────────────
// PART 2. 가비지 컬렉션 — 참조 추적 유틸
// ─────────────────────────────────────────────────────

/**
 * 도서관 노드 간의 참조 체인을 만든다.
 *   section → shelf → book 순서로 next 프로퍼티로 연결.
 *
 * @param {object} section  예: { name: "소설" }
 * @param {object} shelf    예: { name: "A-1" }
 * @param {object} book     예: { title: "어린왕자" }
 * @returns {object} section (체인의 시작)
 *
 * 완성 후 구조:
 *   section.next === shelf
 *   shelf.next   === book
 */
export function buildRefChain(section, shelf, book) {
  // TODO
}

/**
 * 체인의 중간 노드(shelf)에 대한 외부 참조를 제거하면
 * section → shelf → book 체인은 여전히 section을 통해 도달 가능하다.
 *
 * 이 함수는 section의 next(shelf)를 null로 끊고,
 * 기존 shelf 객체를 반환한다.
 * (반환된 값을 변수에 담지 않으면 shelf는 GC 대상이 됨)
 *
 * @param {object} section
 * @returns {object} 끊기 전의 shelf 객체
 */
export function cutChain(section) {
  // TODO
}

// ─────────────────────────────────────────────────────
// PART 3. 메서드 & this
// ─────────────────────────────────────────────────────

/**
 * 도서관 카운터 객체를 반환한다.
 *
 * 반환 객체는 다음을 가져야 한다:
 *   - count: 0 (대출 횟수)
 *   - increment(): count를 1 증가시키고, 증가된 count를 반환
 *   - decrement(): count를 1 감소시키고, 감소된 count를 반환
 *                  단, count가 0 미만으로 내려가면 에러를 throw
 *   - reset(): count를 0으로 초기화, undefined 반환
 *
 * 조건:
 *   - 메서드는 반드시 일반 함수(function 키워드 또는 메서드 축약형)로 작성.
 *   - 화살표 함수로 메서드를 정의하면 this 바인딩 테스트에서 실패함.
 *
 * @returns {object}
 */
export function createCounter() {
  // TODO
}

// ─────────────────────────────────────────────────────
// PART 5. 옵셔널 체이닝 & Nullish 병합
// ─────────────────────────────────────────────────────

/**
 * 회원 데이터에서 도시명을 안전하게 추출한다.
 *
 * @param {object|null|undefined} member
 * @returns {string}
 *
 * 반환 규칙:
 *   - member가 null/undefined               → "unknown"
 *   - member.address가 없거나 null          → "no address"
 *   - member.address.city가 없거나 null     → "no city"
 *   - 정상                                  → city 문자열
 *
 * 조건: 옵셔널 체이닝(?.)과 nullish 병합(??) 을 반드시 사용할 것.
 *        if/else, try-catch 사용 금지.
 */
export function getMemberCity(member) {
  // TODO
}

/**
 * 회원의 선호 장르 목록 중 첫 번째를 반환한다.
 * member?.preferences?.genres 구조를 가진다.
 *
 * @param {object|null|undefined} member
 * @returns {string}
 *
 * 반환 규칙:
 *   - 경로 어느 곳이든 없으면 → "장르 없음"
 *   - genres 배열이 비어 있으면 → "장르 없음"
 *   - 정상 → genres[0]
 *
 * 조건: 옵셔널 체이닝(?.)과 nullish 병합(??)만 사용.
 */
export function getFirstGenre(member) {
  // TODO
}

/**
 * 회원 객체에 notifyDue 메서드가 있으면 호출하고 결과를 반환,
 * 없으면 "알림 기능 없음"을 반환한다.
 *
 * 조건: 옵셔널 체이닝으로 메서드를 호출할 것 (if 분기 금지).
 *
 * @param {object|null|undefined} member
 * @returns {*}
 */
export function notifyMember(member) {
  // TODO
}
