import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  .chart {}
  .chart-toggle {
    display: flex;
    flex-direction: column;
    margin-left: 2rem;
    button {
      background: #6897E7;
      border: none;
      border-radius: 0.2rem;
      margin-bottom: 1rem;
      padding: 0.5rem 2rem;
      color: white;
      font-weight: bold;
      &:hover {
        background: #78a7f7;
        cursor: pointer;
      }
    }
  }
`;
