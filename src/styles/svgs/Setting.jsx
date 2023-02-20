import React from 'react';

const Setting = (props) => {
    const {className, style} = props;
    return (
        <svg
        width="18"
        height="19"
        viewBox="0 0 18 19"
        // fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        <path
          d="M12.9635 16.4885L12.6638 15.9687L12.9635 16.4885ZM10.0489 17.8924L9.92389 17.3055L10.0489 17.8924ZM5.09207 16.4885L4.79236 17.0082H4.79236L5.09207 16.4885ZM8.00663 17.8924L8.13167 17.3055L8.00663 17.8924ZM16.8529 12.5678L16.2761 12.4028L16.8529 12.5678ZM13.1198 16.3983L13.4196 16.9181L13.1198 16.3983ZM15.6289 14.7132L15.1943 14.2995L15.6289 14.7132ZM13.1198 2.6017L13.4196 2.08192V2.08192L13.1198 2.6017ZM15.6289 4.28676L15.1943 4.70048L15.6289 4.28676ZM16.8529 6.4322L16.2761 6.59718L16.8529 6.4322ZM5.09207 2.51154L4.79236 1.99175V1.99175L5.09207 2.51154ZM8.00663 1.10765L8.13167 1.69447L8.00663 1.10765ZM12.9635 2.51154L12.6638 3.03132V3.03132L12.9635 2.51154ZM10.0489 1.10765L9.92388 1.69447L10.0489 1.10765ZM1 9.5H0.4H1ZM1.20263 6.4322L1.7795 6.59718L1.20263 6.4322ZM4.93571 2.6017L5.23542 3.12148H5.23542L4.93571 2.6017ZM2.42668 4.28676L1.99213 3.87303L2.42668 4.28676ZM1.20263 12.5678L0.625756 12.7328L1.20263 12.5678ZM4.93571 16.3983L5.23542 15.8785L5.23542 15.8785L4.93571 16.3983ZM2.42668 14.7132L1.99213 15.127L2.42668 14.7132ZM5.23542 3.12148L5.39178 3.03132L4.79236 1.99175L4.636 2.08192L5.23542 3.12148ZM12.6638 3.03132L12.8201 3.12148L13.4196 2.08192L13.2632 1.99176L12.6638 3.03132ZM12.8201 15.8785L12.6638 15.9687L13.2632 17.0082L13.4196 16.9181L12.8201 15.8785ZM5.39179 15.9687L5.23542 15.8785L4.636 16.9181L4.79236 17.0082L5.39179 15.9687ZM12.6638 15.9687C11.1931 16.8167 10.5704 17.1678 9.92389 17.3055L10.174 18.4792C11.0497 18.2926 11.8626 17.8158 13.2632 17.0082L12.6638 15.9687ZM4.79236 17.0082C6.19293 17.8158 7.00582 18.2926 7.88158 18.4792L8.13167 17.3055C7.4852 17.1678 6.86247 16.8167 5.39179 15.9687L4.79236 17.0082ZM9.92389 17.3055C9.33276 17.4315 8.7228 17.4315 8.13167 17.3055L7.88158 18.4792C8.63759 18.6403 9.41797 18.6403 10.174 18.4792L9.92389 17.3055ZM16.4556 9.5C16.4556 11.1087 16.4501 11.7944 16.2761 12.4028L17.4298 12.7328C17.6611 11.9241 17.6556 11.037 17.6556 9.5H16.4556ZM13.4196 16.9181C14.7252 16.1652 15.4864 15.733 16.0634 15.127L15.1943 14.2995C14.7651 14.7503 14.1891 15.0892 12.8201 15.8785L13.4196 16.9181ZM16.2761 12.4028C16.0716 13.1176 15.6998 13.7686 15.1943 14.2995L16.0634 15.127C16.7039 14.4542 17.1726 13.632 17.4298 12.7328L16.2761 12.4028ZM12.8201 3.12148C14.1891 3.91081 14.7651 4.24969 15.1943 4.70048L16.0634 3.87303C15.4864 3.26701 14.7252 2.83479 13.4196 2.08192L12.8201 3.12148ZM17.6556 9.5C17.6556 7.96302 17.6611 7.07587 17.4298 6.26722L16.2761 6.59718C16.4501 7.20561 16.4556 7.8913 16.4556 9.5H17.6556ZM15.1943 4.70048C15.6998 5.23136 16.0716 5.88242 16.2761 6.59718L17.4298 6.26722C17.1726 5.36804 16.7039 4.54578 16.0634 3.87303L15.1943 4.70048ZM5.39178 3.03132C6.86247 2.1833 7.4852 1.83223 8.13167 1.69447L7.88158 0.520823C7.00582 0.707439 6.19293 1.18417 4.79236 1.99175L5.39178 3.03132ZM13.2632 1.99176C11.8626 1.18417 11.0497 0.707439 10.174 0.520823L9.92388 1.69447C10.5704 1.83223 11.1931 2.1833 12.6638 3.03132L13.2632 1.99176ZM8.13167 1.69447C8.7228 1.56851 9.33275 1.56851 9.92388 1.69447L10.174 0.520823C9.41797 0.359726 8.63759 0.359726 7.88158 0.520823L8.13167 1.69447ZM1.6 9.5C1.6 7.8913 1.6055 7.20561 1.7795 6.59718L0.625755 6.26722C0.394497 7.07587 0.4 7.96302 0.4 9.5H1.6ZM4.636 2.08191C3.33032 2.83479 2.56911 3.26701 1.99213 3.87303L2.86122 4.70048C3.29041 4.24969 3.86651 3.91081 5.23542 3.12148L4.636 2.08191ZM1.7795 6.59718C1.98391 5.88242 2.35578 5.23136 2.86122 4.70048L1.99213 3.87303C1.35161 4.54578 0.882908 5.36803 0.625755 6.26722L1.7795 6.59718ZM0.4 9.5C0.4 11.037 0.394498 11.9241 0.625756 12.7328L1.7795 12.4028C1.6055 11.7944 1.6 11.1087 1.6 9.5H0.4ZM5.23542 15.8785C3.86651 15.0892 3.29041 14.7503 2.86122 14.2995L1.99213 15.127C2.56911 15.733 3.33032 16.1652 4.636 16.9181L5.23542 15.8785ZM0.625756 12.7328C0.882909 13.632 1.35161 14.4542 1.99213 15.127L2.86122 14.2995C2.35578 13.7686 1.98391 13.1176 1.7795 12.4028L0.625756 12.7328ZM9.02778 11.4716C7.98757 11.4716 7.1191 10.603 7.1191 9.5H5.9191C5.9191 11.2375 7.29697 12.6716 9.02778 12.6716V11.4716ZM10.9365 9.5C10.9365 10.603 10.068 11.4716 9.02778 11.4716V12.6716C10.7586 12.6716 12.1365 11.2375 12.1365 9.5H10.9365ZM9.02778 7.52838C10.068 7.52838 10.9365 8.397 10.9365 9.5H12.1365C12.1365 7.76246 10.7586 6.32838 9.02778 6.32838V7.52838ZM9.02778 6.32838C7.29697 6.32838 5.9191 7.76246 5.9191 9.5H7.1191C7.1191 8.397 7.98757 7.52838 9.02778 7.52838V6.32838Z"
          fill="inherit"
        />
      </svg>
    );
}

export default Setting;
